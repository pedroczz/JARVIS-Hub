import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

import { AGENT_SYSTEM_PROMPT } from "@/config/agent-system-prompt";
import type { ClaudeStreamEvent } from "@/types/chat";

export interface RunClaudeOptions {
  prompt: string;
  cwd: string;
  /** true quando o projeto ainda não tem permissão de implementar/refatorar. */
  planOnly: boolean;
  /** sessionId de uma conversa anterior nesta janela de Chat — retoma contexto via --resume. Omitido na primeira mensagem. */
  sessionId?: string;
}

/**
 * Caminho do executável da Claude Code CLI. Por padrão assume `claude` no
 * PATH; em instalações onde só a extensão do VS Code está presente (sem CLI
 * standalone), aponte CLAUDE_CLI_PATH para o binário nativo dela — ver
 * README.md.
 */
const CLAUDE_BIN = process.env.CLAUDE_CLI_PATH?.trim() || "claude";

/**
 * Invoca a Claude Code CLI já instalada na máquina, como processo local —
 * nunca via API remota. O Jarvis não tem "agente próprio": ele é uma casca
 * de UI + orquestração em cima do binário `claude`.
 *
 * `--permission-mode plan` é um gate real, aplicado no servidor: quando o
 * projeto ativo não tem permissão de escrita, a CLI só planeja, nunca
 * executa mudanças — mesmo que o usuário peça diretamente no chat.
 */
export function streamClaudePrompt(options: RunClaudeOptions): ReadableStream<Uint8Array> {
  const { prompt, cwd, planOnly, sessionId } = options;

  // --verbose é exigido pela CLI junto de --print + --output-format stream-json.
  const args = ["-p", prompt, "--output-format", "stream-json", "--verbose"];
  if (planOnly) {
    args.push("--permission-mode", "plan");
  }
  args.push("--append-system-prompt", AGENT_SYSTEM_PROMPT);

  // Continuidade de conversa: sem isso, cada mensagem do Chat era um
  // processo `claude` novo e sem memória da mensagem anterior. Com
  // sessionId existente, retoma via --resume; senão gera um novo e o
  // repassa pro cliente guardar (evento "session"), pra próxima mensagem
  // já vir com --resume.
  const effectiveSessionId = sessionId ?? randomUUID();
  args.push(sessionId ? "--resume" : "--session-id", effectiveSessionId);

  const encoder = new TextEncoder();
  let child: ReturnType<typeof spawn> | null = null;
  // O consumidor (fetch do navegador) pode desconectar a qualquer momento —
  // navegação, refresh, timeout de proxy. Sem essa guarda, os listeners do
  // child_process continuam chamando controller.enqueue()/close() depois que
  // o controller já foi fechado, derrubando o processo com uma exceção não
  // tratada a cada chunk de stdout/stderr que ainda chegar.
  let closed = false;

  const closeController = (controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (closed) return;
    closed = true;
    try {
      controller.close();
    } catch {
      // já fechado pelo runtime (ex.: consumidor cancelou) — nada a fazer.
    }
  };

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: ClaudeStreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          closed = true;
        }
      };

      send({ type: "system", subtype: "init", permissionMode: planOnly ? "plan" : "default" });
      send({ type: "session", sessionId: effectiveSessionId });

      const proc = spawn(CLAUDE_BIN, args, { cwd, shell: false });
      child = proc;

      let buffer = "";

      proc.stdout.on("data", (chunk: Buffer) => {
        buffer += chunk.toString("utf-8");
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            forwardParsedLine(parsed, send);
          } catch {
            send({ type: "assistant", text: line });
          }
        }
      });

      proc.stderr.on("data", (chunk: Buffer) => {
        send({ type: "error", message: chunk.toString("utf-8") });
      });

      proc.on("error", (err) => {
        send({
          type: "error",
          message: `Não foi possível iniciar a Claude Code CLI ("${CLAUDE_BIN}"): ${err.message}. Verifique se "claude" está no PATH ou defina CLAUDE_CLI_PATH no .env.local.`,
        });
        closeController(controller);
      });

      proc.on("close", (code) => {
        send({
          type: "result",
          subtype: code === 0 ? "success" : "error",
          summary: code === 0 ? undefined : `Processo encerrado com código ${code}`,
        });
        closeController(controller);
      });
    },
    cancel() {
      // Consumidor desconectou (navegação, refresh, aba fechada) — mata o
      // processo em vez de deixá-lo órfão rodando até terminar sozinho.
      closed = true;
      child?.kill();
    },
  });
}

/**
 * Resume o input de uma tool_use num texto curto e legível — o que o
 * usuário precisa pra saber "o que ela tá fazendo", sem despejar o JSON
 * bruto do input inteiro (que pra Write/Edit inclui o conteúdo do arquivo).
 */
function summarizeToolInput(name: string, input: Record<string, unknown>): string | undefined {
  switch (name) {
    case "Write":
    case "Edit":
    case "Read":
      return typeof input.file_path === "string" ? input.file_path : undefined;
    case "Bash":
      return typeof input.command === "string" ? input.command : undefined;
    case "Grep":
    case "Glob":
      return typeof input.pattern === "string" ? input.pattern : undefined;
    default:
      return undefined;
  }
}

/**
 * O `stream-json` real da CLI aninha o texto em `message.content[]` (blocos
 * `text`, `thinking`, `tool_use`). Blocos `text` viram a resposta em si;
 * `tool_use` vira um evento "tool" (visibilidade do que está sendo feito no
 * disco, sem que o usuário precise abrir a pasta manualmente pra saber);
 * `thinking`, `tool_result`, eventos de sistema/rate-limit continuam
 * silenciados — são ruído interno demais pra virar UI.
 */
export function forwardParsedLine(
  parsed: unknown,
  send: (event: ClaudeStreamEvent) => void
): void {
  if (typeof parsed !== "object" || parsed === null) return;
  const obj = parsed as Record<string, unknown>;

  if (obj.type === "assistant" && typeof obj.message === "object" && obj.message !== null) {
    const message = obj.message as Record<string, unknown>;
    const content = Array.isArray(message.content) ? message.content : [];
    for (const block of content) {
      if (typeof block !== "object" || block === null) continue;
      const b = block as Record<string, unknown>;
      if (b.type === "text" && typeof b.text === "string") {
        send({ type: "assistant", text: b.text });
      } else if (b.type === "tool_use" && typeof b.name === "string") {
        const input = typeof b.input === "object" && b.input !== null ? (b.input as Record<string, unknown>) : {};
        send({ type: "tool", name: b.name, detail: summarizeToolInput(b.name, input) });
      }
    }
    return;
  }

  if (obj.type === "result") {
    send({
      type: "result",
      subtype: obj.subtype === "error" ? "error" : "success",
      summary: typeof obj.summary === "string" ? obj.summary : undefined,
    });
    return;
  }

  // system/user (tool_result)/rate_limit_event/etc — eventos internos da CLI.
}

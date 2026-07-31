import { spawn } from "node:child_process";

import type { ClaudeStreamEvent } from "@/types/chat";

export interface RunClaudeOptions {
  prompt: string;
  cwd: string;
  /** true quando o projeto ainda não tem permissão de implementar/refatorar. */
  planOnly: boolean;
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
  const { prompt, cwd, planOnly } = options;

  // --verbose é exigido pela CLI junto de --print + --output-format stream-json.
  const args = ["-p", prompt, "--output-format", "stream-json", "--verbose"];
  if (planOnly) {
    args.push("--permission-mode", "plan");
  }

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: ClaudeStreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      send({ type: "system", subtype: "init", permissionMode: planOnly ? "plan" : "default" });

      const child = spawn(CLAUDE_BIN, args, { cwd, shell: false });

      let buffer = "";

      child.stdout.on("data", (chunk: Buffer) => {
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

      child.stderr.on("data", (chunk: Buffer) => {
        send({ type: "error", message: chunk.toString("utf-8") });
      });

      child.on("error", (err) => {
        send({
          type: "error",
          message: `Não foi possível iniciar a Claude Code CLI ("${CLAUDE_BIN}"): ${err.message}. Verifique se "claude" está no PATH ou defina CLAUDE_CLI_PATH no .env.local.`,
        });
        controller.close();
      });

      child.on("close", (code) => {
        send({
          type: "result",
          subtype: code === 0 ? "success" : "error",
          summary: code === 0 ? undefined : `Processo encerrado com código ${code}`,
        });
        controller.close();
      });
    },
  });
}

/**
 * O `stream-json` real da CLI aninha o texto em `message.content[]` (blocos
 * `text`, `thinking`, `tool_use`) — só os blocos `text` são resposta visível
 * pro usuário; os demais (thinking, tool_use, tool_result, eventos de
 * sistema/rate-limit) são ruído interno de execução e não viram bolha de chat.
 */
function forwardParsedLine(
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

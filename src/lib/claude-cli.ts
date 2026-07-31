import { spawn } from "node:child_process";

import type { ClaudeStreamEvent } from "@/types/chat";

export interface RunClaudeOptions {
  prompt: string;
  cwd: string;
  /** true quando o projeto ainda não tem permissão de implementar/refatorar. */
  planOnly: boolean;
}

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

  const args = ["-p", prompt, "--output-format", "stream-json"];
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

      const child = spawn("claude", args, { cwd, shell: false });

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
          message: `Não foi possível iniciar a Claude Code CLI: ${err.message}. Verifique se "claude" está no PATH.`,
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

function forwardParsedLine(
  parsed: unknown,
  send: (event: ClaudeStreamEvent) => void
): void {
  if (typeof parsed !== "object" || parsed === null) return;
  const obj = parsed as Record<string, unknown>;

  if (obj.type === "assistant" && typeof obj.text === "string") {
    send({ type: "assistant", text: obj.text });
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

  // Formato inesperado da CLI: repassa como texto bruto em vez de silenciar.
  send({ type: "assistant", text: JSON.stringify(obj) });
}

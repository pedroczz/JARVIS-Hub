import { describe, expect, it, vi } from "vitest";

import { forwardParsedLine } from "@/services/claude-cli";
import type { ClaudeStreamEvent } from "@/types/chat";

function capture() {
  const events: ClaudeStreamEvent[] = [];
  return { send: (e: ClaudeStreamEvent) => events.push(e), events };
}

describe("forwardParsedLine", () => {
  it("extrai texto de message.content e ignora thinking, mas ambos são reportados", () => {
    const { send, events } = capture();

    forwardParsedLine(
      {
        type: "assistant",
        message: {
          content: [
            { type: "thinking", thinking: "..." },
            { type: "tool_use", name: "Read", input: { file_path: "README.md" } },
            { type: "text", text: "olá" },
          ],
        },
      },
      send
    );

    expect(events).toEqual([
      { type: "tool", name: "Read", detail: "README.md" },
      { type: "assistant", text: "olá" },
    ]);
  });

  it("tool_use sem input reconhecido manda detail undefined em vez de quebrar", () => {
    const { send, events } = capture();
    forwardParsedLine(
      { type: "assistant", message: { content: [{ type: "tool_use", name: "TodoWrite", input: { todos: [] } }] } },
      send
    );
    expect(events).toEqual([{ type: "tool", name: "TodoWrite", detail: undefined }]);
  });

  it("repassa result com subtype success/error", () => {
    const { send, events } = capture();
    forwardParsedLine({ type: "result", subtype: "error", summary: "falhou" }, send);
    expect(events).toEqual([{ type: "result", subtype: "error", summary: "falhou" }]);
  });

  it("ignora eventos internos (system/user/rate_limit_event) sem gerar bolha de chat", () => {
    const { send, events } = capture();
    forwardParsedLine({ type: "system", subtype: "init" }, send);
    forwardParsedLine({ type: "rate_limit_event", rate_limit_info: {} }, send);
    forwardParsedLine({ type: "user", message: { content: [] } }, send);
    expect(events).toEqual([]);
  });

  it("não quebra com entrada que não é objeto", () => {
    const { send, events } = capture();
    const noop = vi.fn(send);
    forwardParsedLine(null, noop);
    forwardParsedLine("string solta", noop);
    forwardParsedLine(42, noop);
    expect(events).toEqual([]);
  });
});

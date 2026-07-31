"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { MessageBubble } from "@/features/chat/components/message-bubble";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { readSse } from "@/utils/sse-client";
import { useChatStore } from "@/store/use-chat-store";
import type { ClaudeStreamEvent } from "@/types/chat";

function uid(): string {
  return crypto.randomUUID();
}

/** Avisos conhecidos e inofensivos da CLI — não fatais, não viram ruído na bolha de resposta. */
const BENIGN_STDERR_PATTERNS = [
  /^Warning: no stdin data received/,
  /^Ignoring \d+ permissions\.allow entries/,
];

export function ChatWindow({ projectId }: { projectId: string }) {
  const [input, setInput] = useState("");
  const {
    messages,
    isStreaming,
    sessionId,
    addMessage,
    appendToMessage,
    finishMessage,
    setStreaming,
    setSessionId,
  } = useChatStore();

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || isStreaming) return;

    addMessage({ id: uid(), role: "user", content: prompt, createdAt: new Date().toISOString() });
    setInput("");

    const assistantId = uid();
    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      streaming: true,
    });
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, projectId, sessionId }),
      });

      await readSse<ClaudeStreamEvent>(res, (event) => {
        if (event.type === "assistant") {
          appendToMessage(assistantId, event.text);
        } else if (event.type === "session") {
          setSessionId(event.sessionId);
        } else if (event.type === "error") {
          if (BENIGN_STDERR_PATTERNS.some((pattern) => pattern.test(event.message))) return;
          appendToMessage(assistantId, `\n[erro] ${event.message}`);
        }
      });
    } finally {
      finishMessage(assistantId);
      setStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-3 pb-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Converse em linguagem natural. A CLI roda como processo local — nada sai da sua máquina.
            </p>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-end gap-2 border-t border-border pt-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Peça algo ao Claude Code…"
          className="min-h-11"
        />
        <Button onClick={send} disabled={isStreaming || !input.trim()} size="icon">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

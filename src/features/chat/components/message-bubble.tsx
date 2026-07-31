import { Wrench } from "lucide-react";

import { cn } from "@/utils/cn";
import type { ChatMessage } from "@/types/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <div className="flex items-center gap-1.5 pl-1 font-mono text-xs text-muted-foreground">
        <Wrench className="size-3 shrink-0" />
        <span className="truncate">{message.content}</span>
      </div>
    );
  }

  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {message.content || (message.streaming ? "…" : "")}
      </div>
    </div>
  );
}

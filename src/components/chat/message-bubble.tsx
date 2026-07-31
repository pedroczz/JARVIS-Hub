import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

export function MessageBubble({ message }: { message: ChatMessage }) {
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

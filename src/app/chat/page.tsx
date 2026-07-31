"use client";

import { ChatWindow } from "@/features/chat/components/chat-window";
import { useProjectStore } from "@/store/use-project-store";

export default function ChatPage() {
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  if (!activeProjectId) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
        <p className="text-sm text-muted-foreground">
          Selecione um projeto no topo da tela para começar a conversar com a Claude Code CLI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
      <ChatWindow projectId={activeProjectId} />
    </div>
  );
}

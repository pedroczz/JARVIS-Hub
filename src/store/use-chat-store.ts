import { create } from "zustand";

import type { ChatMessage } from "@/types/chat";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  /** sessionId da CLI pra essa conversa — mensagens seguintes reenviam pra manter contexto (--resume). */
  sessionId: string | null;
  addMessage: (message: ChatMessage) => void;
  appendToMessage: (id: string, delta: string) => void;
  finishMessage: (id: string) => void;
  setStreaming: (streaming: boolean) => void;
  setSessionId: (sessionId: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  sessionId: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  appendToMessage: (id, delta) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + delta } : m
      ),
    })),
  finishMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
    })),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setSessionId: (sessionId) => set({ sessionId }),
  // Trocar de projeto descarta a sessão da CLI junto com o histórico —
  // nunca retomar contexto de um projeto diferente.
  reset: () => set({ messages: [], isStreaming: false, sessionId: null }),
}));

import { create } from "zustand";

import type { ChatMessage } from "@/types/chat";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (message: ChatMessage) => void;
  appendToMessage: (id: string, delta: string) => void;
  finishMessage: (id: string) => void;
  setStreaming: (streaming: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
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
  reset: () => set({ messages: [], isStreaming: false }),
}));

import { create } from "zustand";

import { useChatStore } from "./use-chat-store";

interface ProjectSelectionState {
  activeProjectId: string | null;
  /** Trocar de projeto descarta o chat/sessão do anterior — nunca vaza contexto entre projetos. */
  setActiveProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectSelectionState>((set) => ({
  activeProjectId: null,
  setActiveProject: (id) => {
    useChatStore.getState().reset();
    set({ activeProjectId: id });
  },
}));

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  streaming?: boolean;
}

export interface ChatSession {
  id: string;
  projectId: string;
  messages: ChatMessage[];
}

/** Eventos emitidos pela rota /api/chat via SSE, espelhando `claude --output-format stream-json`. */
export type ClaudeStreamEvent =
  | { type: "system"; subtype: "init"; permissionMode: string }
  | { type: "assistant"; text: string }
  | { type: "result"; subtype: "success" | "error"; summary?: string }
  | { type: "error"; message: string };

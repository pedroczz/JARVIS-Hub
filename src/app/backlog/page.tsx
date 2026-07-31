import { ListTodo } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function BacklogPage() {
  return (
    <StubPage
      icon={ListTodo}
      title="Backlog"
      description="Leitura e edição do BACKLOG.md do projeto conectado, direto de .jarvis/memory/."
    />
  );
}

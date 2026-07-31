import { Settings } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function ConfiguracoesPage() {
  return (
    <StubPage
      icon={Settings}
      title="Configurações"
      description="Preferências do Jarvis Hub: caminho da CLI, tema, atalhos."
    />
  );
}

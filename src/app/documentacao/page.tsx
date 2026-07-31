import { FileText } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function DocumentacaoPage() {
  return (
    <StubPage
      icon={FileText}
      title="Documentação"
      description="Geração e edição de documentação (README, docs internos) do projeto conectado."
    />
  );
}

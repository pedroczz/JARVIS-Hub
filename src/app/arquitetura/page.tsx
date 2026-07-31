import { Boxes } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function ArquiteturaPage() {
  return (
    <StubPage
      icon={Boxes}
      title="Arquitetura"
      description="Visualização da arquitetura do projeto conectado, gerada a partir da análise da Claude Code CLI."
    />
  );
}

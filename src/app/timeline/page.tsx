import { History } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function TimelinePage() {
  return (
    <StubPage
      icon={History}
      title="Timeline"
      description="Linha do tempo de mudanças, commits e decisões (CHANGELOG + ADR) do projeto conectado."
    />
  );
}

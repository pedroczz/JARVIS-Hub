import { ScrollText } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function LogsPage() {
  return (
    <StubPage
      icon={ScrollText}
      title="Logs"
      description="Histórico de execuções da CLI e das operações de Git por projeto."
    />
  );
}

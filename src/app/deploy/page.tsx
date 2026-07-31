import { Rocket } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function DeployPage() {
  return (
    <StubPage
      icon={Rocket}
      title="Deploy"
      description="Deploy do projeto conectado a partir do gate de permissão 'deploy' — ainda não implementado."
    />
  );
}

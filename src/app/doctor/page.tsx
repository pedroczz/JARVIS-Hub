import { Stethoscope } from "lucide-react";

import { StubPage } from "@/components/layout/stub-page";

export default function DoctorPage() {
  return (
    <StubPage
      icon={Stethoscope}
      title="Doctor"
      description="Diagnóstico de saúde do projeto conectado: dependências desatualizadas, CVEs, configuração quebrada."
    />
  );
}

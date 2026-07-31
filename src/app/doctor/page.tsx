import { HealthPanel } from "@/features/doctor/components/health-panel";

export default function DoctorPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Doctor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saúde dos módulos registrados no Core — CLI, Git, registry de projetos.
        </p>
      </div>
      <HealthPanel />
    </div>
  );
}

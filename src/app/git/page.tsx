"use client";

import { GitPanel } from "@/components/git/git-panel";
import { useProjectStore } from "@/stores/use-project-store";

export default function GitPage() {
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  if (!activeProjectId) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Git</h1>
        <p className="text-sm text-muted-foreground">
          Selecione um projeto no topo da tela para ver status, histórico e publicar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Git</h1>
      <GitPanel projectId={activeProjectId} />
    </div>
  );
}

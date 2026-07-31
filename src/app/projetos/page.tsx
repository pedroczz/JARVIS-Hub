"use client";

import { useQuery } from "@tanstack/react-query";

import { ConnectProjectDialog } from "@/components/projects/connect-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Falha ao carregar projetos");
  return (await res.json()).projects;
}

export default function ProjetosPage() {
  const { data: projects, isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada projeto tem memória isolada em <code>.jarvis/memory/</code> e permissões próprias.
          </p>
        </div>
        <ConnectProjectDialog />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {!isLoading && projects?.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum projeto conectado ainda.</p>
      )}

      <div className="grid gap-4">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

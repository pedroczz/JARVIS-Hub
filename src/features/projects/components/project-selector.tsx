"use client";

import { useQuery } from "@tanstack/react-query";

import { useProjectStore } from "@/store/use-project-store";
import type { Project } from "@/types/project";

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Falha ao carregar projetos");
  const data = await res.json();
  return data.projects;
}

export function ProjectSelector() {
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  return (
    <select
      value={activeProjectId ?? ""}
      onChange={(e) => setActiveProject(e.target.value || null)}
      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <option value="">Nenhum projeto conectado</option>
      {projects?.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  );
}

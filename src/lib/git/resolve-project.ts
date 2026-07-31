import { NextResponse } from "next/server";

import { getProject } from "@/lib/registry";
import type { Project } from "@/types/project";

export async function resolveProjectOrError(
  projectId: string | null
): Promise<{ project: Project } | { error: NextResponse }> {
  if (!projectId) {
    return { error: NextResponse.json({ error: "Campo 'projectId' é obrigatório." }, { status: 400 }) };
  }

  const project = await getProject(projectId);
  if (!project) {
    return { error: NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 }) };
  }

  return { project };
}

export function requirePermission(
  project: Project,
  permission: keyof Project["permissions"]
): NextResponse | null {
  if (!project.permissions[permission]) {
    return NextResponse.json(
      { error: `Projeto sem permissão '${permission}'.` },
      { status: 403 }
    );
  }
  return null;
}

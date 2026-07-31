import { NextResponse } from "next/server";

import { getProject } from "@/lib/registry";
import type { Project } from "@/types/project";

import { GitError } from "./client";

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

/**
 * Toda rota /api/git/* chama isso em volta da operação real: comandos git
 * falham o tempo todo por razões esperadas (projeto ainda sem `.git`, branch
 * inexistente, nada pra commitar) — sem isso, cada uma vazava como um 500 cru
 * com stack trace em vez de um erro que a UI consegue mostrar.
 */
export async function runGitOrError<T>(operation: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await operation();
  } catch (err) {
    if (err instanceof GitError) {
      const notARepo = /not a git repository/i.test(err.stderr);
      return NextResponse.json(
        { error: notARepo ? "Este projeto ainda não é um repositório git." : err.stderr || err.message },
        { status: notARepo ? 409 : 400 }
      );
    }
    throw err;
  }
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

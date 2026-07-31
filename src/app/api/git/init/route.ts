import { NextRequest, NextResponse } from "next/server";

import { detectProject } from "@/services/detect";
import { initRepo } from "@/services/git/operations";
import { requirePermission, resolveProjectOrError, runGitOrError } from "@/services/git/resolve-project";
import { updateProjectDetection } from "@/services/registry";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  const result = await runGitOrError(() => initRepo(resolved.project.path));
  if (result instanceof NextResponse) return result;

  // Refresca a detecção salva no registry — sem isso, hasGit continuaria
  // false até o usuário desconectar e reconectar o projeto manualmente.
  const detection = await detectProject(resolved.project.path);
  await updateProjectDetection(resolved.project.id, detection);

  return NextResponse.json({ ok: true, detection });
}

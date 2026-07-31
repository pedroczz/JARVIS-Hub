import { NextRequest, NextResponse } from "next/server";

import { commit } from "@/services/git/operations";
import { requirePermission, resolveProjectOrError, runGitOrError } from "@/services/git/resolve-project";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  const message = typeof body.message === "string" ? body.message : null;
  if (!message) return NextResponse.json({ error: "Campo 'message' é obrigatório." }, { status: 400 });

  const output = await runGitOrError(() => commit(resolved.project.path, message));
  if (output instanceof NextResponse) return output;
  return NextResponse.json({ output });
}

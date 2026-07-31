import { NextRequest, NextResponse } from "next/server";

import { checkoutBranch } from "@/services/git/operations";
import { requirePermission, resolveProjectOrError, runGitOrError } from "@/services/git/resolve-project";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  const branch = typeof body.branch === "string" ? body.branch : null;
  if (!branch) return NextResponse.json({ error: "Campo 'branch' é obrigatório." }, { status: 400 });

  const result = await runGitOrError(() => checkoutBranch(resolved.project.path, branch));
  if (result instanceof NextResponse) return result;
  return NextResponse.json({ ok: true });
}

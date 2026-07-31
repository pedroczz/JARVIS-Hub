import { NextRequest, NextResponse } from "next/server";

import { pull } from "@/services/git/operations";
import { requirePermission, resolveProjectOrError, runGitOrError } from "@/services/git/resolve-project";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  const output = await runGitOrError(() => pull(resolved.project.path));
  if (output instanceof NextResponse) return output;
  return NextResponse.json({ output });
}

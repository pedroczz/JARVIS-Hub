import { NextRequest, NextResponse } from "next/server";

import { getRemotes } from "@/lib/git/operations";
import { resolveProjectOrError, runGitOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const remotes = await runGitOrError(() => getRemotes(resolved.project.path));
  if (remotes instanceof NextResponse) return remotes;
  return NextResponse.json({ remotes });
}

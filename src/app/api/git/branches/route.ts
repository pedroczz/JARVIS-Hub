import { NextRequest, NextResponse } from "next/server";

import { getBranches } from "@/lib/git/operations";
import { resolveProjectOrError, runGitOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const branches = await runGitOrError(() => getBranches(resolved.project.path));
  if (branches instanceof NextResponse) return branches;
  return NextResponse.json({ branches });
}

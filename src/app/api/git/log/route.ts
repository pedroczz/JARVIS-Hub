import { NextRequest, NextResponse } from "next/server";

import { getLog } from "@/services/git/operations";
import { resolveProjectOrError, runGitOrError } from "@/services/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const log = await runGitOrError(() =>
    getLog(resolved.project.path, limitParam ? Number(limitParam) : undefined)
  );
  if (log instanceof NextResponse) return log;
  return NextResponse.json({ log });
}

import { NextRequest, NextResponse } from "next/server";

import { getDiff } from "@/lib/git/operations";
import { resolveProjectOrError, runGitOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const filePath = request.nextUrl.searchParams.get("path") ?? undefined;
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const diff = await runGitOrError(() => getDiff(resolved.project.path, filePath));
  if (diff instanceof NextResponse) return diff;
  return NextResponse.json({ diff });
}

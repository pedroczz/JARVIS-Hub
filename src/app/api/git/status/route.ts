import { NextRequest, NextResponse } from "next/server";

import { getStatus } from "@/lib/git/operations";
import { resolveProjectOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const status = await getStatus(resolved.project.path);
  return NextResponse.json({ status });
}

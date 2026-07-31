import { NextRequest, NextResponse } from "next/server";

import { getLog } from "@/lib/git/operations";
import { resolveProjectOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const log = await getLog(resolved.project.path, limitParam ? Number(limitParam) : undefined);
  return NextResponse.json({ log });
}

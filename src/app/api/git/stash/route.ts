import { NextRequest, NextResponse } from "next/server";

import { stashList, stashSave } from "@/lib/git/operations";
import { requirePermission, resolveProjectOrError } from "@/lib/git/resolve-project";

export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  const resolved = await resolveProjectOrError(projectId);
  if ("error" in resolved) return resolved.error;

  const stashes = await stashList(resolved.project.path);
  return NextResponse.json({ stashes });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  const output = await stashSave(resolved.project.path, body.message);
  return NextResponse.json({ output });
}

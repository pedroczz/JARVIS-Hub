import { NextRequest, NextResponse } from "next/server";

import { stageAll } from "@/lib/git/operations";
import { requirePermission, resolveProjectOrError } from "@/lib/git/resolve-project";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "git");
  if (forbidden) return forbidden;

  await stageAll(resolved.project.path);
  return NextResponse.json({ ok: true });
}

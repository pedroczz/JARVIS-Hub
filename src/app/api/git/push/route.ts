import { NextRequest, NextResponse } from "next/server";

import { push } from "@/lib/git/operations";
import { requirePermission, resolveProjectOrError } from "@/lib/git/resolve-project";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "push");
  if (forbidden) return forbidden;

  const output = await push(resolved.project.path);
  return NextResponse.json({ output });
}

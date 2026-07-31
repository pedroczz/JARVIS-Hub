import { NextRequest, NextResponse } from "next/server";

import { detectProject } from "@/lib/detect";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const projectPath = typeof body.path === "string" ? body.path : null;

  if (!projectPath) {
    return NextResponse.json({ error: "Campo 'path' é obrigatório." }, { status: 400 });
  }

  const detection = await detectProject(projectPath);
  return NextResponse.json({ detection });
}

import { NextRequest, NextResponse } from "next/server";
import path from "node:path";

import { detectProject } from "@/lib/detect";
import { ensureMemory } from "@/lib/memory";
import { connectProject, listProjects } from "@/lib/registry";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const projectPath = typeof body.path === "string" ? body.path : null;

  if (!projectPath) {
    return NextResponse.json({ error: "Campo 'path' é obrigatório." }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name : path.basename(projectPath);
  const detection = await detectProject(projectPath);
  const project = await connectProject(projectPath, name, detection);
  await ensureMemory(project.path, project.name);

  return NextResponse.json({ project }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { stat } from "node:fs/promises";
import path from "node:path";

import { detectProject } from "@/services/detect";
import { ensureMemory } from "@/services/memory";
import { connectProject, listProjects } from "@/services/registry";

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

  // O Jarvis só opera sobre pastas locais que já existem — nunca cria um
  // projeto do zero nem busca nada remoto (GitHub, etc.) a partir do nome.
  // Sem essa checagem, ensureMemory() criaria a árvore de pastas via
  // mkdir recursivo e "conectaria" um projeto fantasma vazio.
  let stats;
  try {
    stats = await stat(projectPath);
  } catch {
    return NextResponse.json(
      { error: `Caminho não encontrado: "${projectPath}". Verifique se a pasta existe (o Jarvis não clona nem busca projetos remotos).` },
      { status: 404 }
    );
  }
  if (!stats.isDirectory()) {
    return NextResponse.json({ error: `"${projectPath}" não é uma pasta.` }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name : path.basename(projectPath);
  const detection = await detectProject(projectPath);
  const project = await connectProject(projectPath, name, detection);
  await ensureMemory(project.path, project.name);

  return NextResponse.json({ project }, { status: 201 });
}

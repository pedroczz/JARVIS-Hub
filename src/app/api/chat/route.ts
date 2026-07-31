import { NextRequest, NextResponse } from "next/server";

import { streamClaudePrompt } from "@/lib/claude-cli";
import { getProject } from "@/lib/registry";
import { hasWriteAccess } from "@/types/permissions";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prompt = typeof body.prompt === "string" ? body.prompt : null;
  const projectId = typeof body.projectId === "string" ? body.projectId : null;

  if (!prompt || !projectId) {
    return NextResponse.json({ error: "Campos 'prompt' e 'projectId' são obrigatórios." }, { status: 400 });
  }

  const project = await getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  // Gate real no servidor: sem permissão de implementar/refatorar, a CLI
  // roda em --permission-mode plan mesmo que o cliente peça o contrário.
  const planOnly = !hasWriteAccess(project.permissions);

  const stream = streamClaudePrompt({ prompt, cwd: project.path, planOnly });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

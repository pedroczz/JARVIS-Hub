import { NextRequest, NextResponse } from "next/server";

import { publishProject } from "@/lib/git/publish";
import { requirePermission, resolveProjectOrError } from "@/lib/git/resolve-project";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const resolved = await resolveProjectOrError(body.projectId ?? null);
  if ("error" in resolved) return resolved.error;

  const forbidden = requirePermission(resolved.project, "push");
  if (forbidden) return forbidden;

  const commitMessage = typeof body.commitMessage === "string" ? body.commitMessage : null;
  if (!commitMessage) {
    return NextResponse.json({ error: "Campo 'commitMessage' é obrigatório." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const { project } = resolved;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const result of publishProject({ cwd: project.path, commitMessage })) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(result)}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

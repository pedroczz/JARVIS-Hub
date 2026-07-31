import { NextRequest, NextResponse } from "next/server";

import { disconnectProject, getProject, updateProjectPermissions } from "@/lib/registry";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const project = await updateProjectPermissions(id, body.permissions);
  if (!project) return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await disconnectProject(id);
  return NextResponse.json({ ok: true });
}

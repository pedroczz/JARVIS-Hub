import { NextResponse } from "next/server";

import { bootstrapCore } from "@/core/bootstrap";
import { runHealthChecks } from "@/core/health";
import { listModules } from "@/core/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  bootstrapCore();

  const [modules, health] = await Promise.all([listModules(), runHealthChecks()]);

  return NextResponse.json({
    modules: modules.map((m) => ({
      name: m.name,
      version: m.version,
      description: m.description,
      dependencies: m.dependencies ?? [],
    })),
    health,
  });
}

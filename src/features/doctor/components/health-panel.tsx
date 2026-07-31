"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HealthState } from "@/core/types";

interface HealthResponse {
  modules: { name: string; version: string; description: string; dependencies: string[] }[];
  health: { module: string; state: HealthState; detail?: string }[];
}

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Falha ao consultar saúde dos módulos.");
  return res.json();
}

const STATE_ICON: Record<HealthState, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  degraded: CircleAlert,
  down: XCircle,
};

const STATE_VARIANT: Record<HealthState, "success" | "outline" | "destructive"> = {
  healthy: "success",
  degraded: "outline",
  down: "destructive",
};

export function HealthPanel() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Verificando módulos…</p>;

  return (
    <div className="space-y-4">
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        {isFetching ? "verificando…" : "verificar novamente"}
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        {data?.modules.map((mod) => {
          const status = data.health.find((h) => h.module === mod.name);
          const state = status?.state ?? "healthy";
          const Icon = STATE_ICON[state];

          return (
            <Card key={mod.name}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm">{mod.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{mod.description}</p>
                </div>
                <Icon className={`size-4 shrink-0 ${state === "down" ? "text-destructive" : state === "degraded" ? "text-muted-foreground" : "text-emerald-500"}`} />
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Badge variant={STATE_VARIANT[state]}>{state}</Badge>
                {mod.dependencies.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    depende de {mod.dependencies.join(", ")}
                  </span>
                )}
              </CardContent>
              {status?.detail && (
                <CardContent className="pt-0 text-xs text-destructive">{status.detail}</CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

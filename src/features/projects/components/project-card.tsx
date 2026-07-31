"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GitBranch, Trash2 } from "lucide-react";

import { PermissionToggles } from "@/features/projects/components/permission-toggles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  const queryClient = useQueryClient();

  const disconnect = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao desconectar projeto");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{project.name}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{project.path}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => disconnect.mutate()} disabled={disconnect.isPending}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.detection?.framework && (
            <Badge variant="secondary">{project.detection.framework}</Badge>
          )}
          {project.detection?.packageManager && (
            <Badge variant="outline">{project.detection.packageManager}</Badge>
          )}
          {project.detection?.hasGit && (
            <Badge variant="outline">
              <GitBranch className="mr-1 size-3" /> git
            </Badge>
          )}
          <Badge variant="outline">{project.detection?.dependencyCount ?? 0} deps</Badge>
        </div>
        <Separator />
        <PermissionToggles projectId={project.id} permissions={project.permissions} />
      </CardContent>
    </Card>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PERMISSION_KEYS, PERMISSION_LABELS, type ProjectPermissions } from "@/types/permissions";

interface PermissionTogglesProps {
  projectId: string;
  permissions: ProjectPermissions;
}

export function PermissionToggles({ projectId, permissions }: PermissionTogglesProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (next: ProjectPermissions) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: next }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar permissões");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const toggle = (key: keyof ProjectPermissions) => {
    mutation.mutate({ ...permissions, [key]: !permissions[key] });
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
      {PERMISSION_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-2">
          <Switch
            id={`${projectId}-${key}`}
            checked={permissions[key]}
            onCheckedChange={() => toggle(key)}
          />
          <Label htmlFor={`${projectId}-${key}`} className="text-xs font-normal text-muted-foreground">
            {PERMISSION_LABELS[key]}
          </Label>
        </div>
      ))}
    </div>
  );
}

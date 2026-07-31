"use client";

import { useQuery } from "@tanstack/react-query";

import { PublishDialog } from "@/components/git/publish-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GitBranch, GitLogEntry, GitStatus } from "@/types/git";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error((await res.json()).error ?? "Falha na requisição");
  return res.json();
}

export function GitPanel({ projectId }: { projectId: string }) {
  const status = useQuery({
    queryKey: ["git-status", projectId],
    queryFn: () => fetchJson<{ status: GitStatus }>(`/api/git/status?projectId=${projectId}`),
  });
  const log = useQuery({
    queryKey: ["git-log", projectId],
    queryFn: () => fetchJson<{ log: GitLogEntry[] }>(`/api/git/log?projectId=${projectId}`),
  });
  const branches = useQuery({
    queryKey: ["git-branches", projectId],
    queryFn: () => fetchJson<{ branches: GitBranch[] }>(`/api/git/branches?projectId=${projectId}`),
  });

  if (status.isError) {
    return (
      <p className="text-sm text-muted-foreground">
        {status.error instanceof Error ? status.error.message : "Falha ao ler o estado do git."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">{status.data?.status.branch ?? "…"}</Badge>
          {status.data && status.data.status.ahead > 0 && (
            <Badge variant="outline">↑{status.data.status.ahead}</Badge>
          )}
          {status.data && status.data.status.behind > 0 && (
            <Badge variant="outline">↓{status.data.status.behind}</Badge>
          )}
        </div>
        <PublishDialog projectId={projectId} />
      </div>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="log">Histórico</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          {status.data?.status.entries.length === 0 && (
            <p className="text-sm text-muted-foreground">Árvore de trabalho limpa.</p>
          )}
          <ul className="space-y-1 font-mono text-xs">
            {status.data?.status.entries.map((entry) => (
              <li key={entry.path}>
                <span className="text-muted-foreground">
                  {entry.index}
                  {entry.worktree}
                </span>{" "}
                {entry.path}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="log">
          <ul className="space-y-2">
            {log.data?.log.map((entry) => (
              <li key={entry.hash} className="text-sm">
                <p>{entry.message}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.author} · {entry.hash.slice(0, 7)}
                </p>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="branches">
          <ul className="space-y-1 text-sm">
            {branches.data?.branches.map((branch) => (
              <li key={branch.name} className="flex items-center gap-2">
                {branch.current && <Badge variant="success">atual</Badge>}
                {branch.name}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}

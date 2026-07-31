import { FolderGit2, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listProjects } from "@/services/registry";

export default async function HomePage() {
  const projects = await listProjects();
  const writable = projects.filter((p) => p.permissions.implement || p.permissions.refactor);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jarvis Development Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dashboard local para operar a Claude Code CLI por linguagem natural — sem API paga,
          sem OpenAI, sem Anthropic API, sem LangChain/Pinecone. Roda 100% na sua máquina.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <FolderGit2 className="size-5 text-primary" />
            <div>
              <CardTitle>{projects.length} projeto(s) conectado(s)</CardTitle>
              <CardDescription>Registry em ~/.jarvis/registry.json</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <ShieldCheck className="size-5 text-primary" />
            <div>
              <CardTitle>{writable.length} com permissão de escrita</CardTitle>
              <CardDescription>Default seguro: só leitura + análise</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Limitações conhecidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Aprovação clique-a-clique antes de mudanças (Safe Mode completo) ainda não existe — só o gate binário de permissão.</p>
          <p>UI de merge/rebase/stash/tag/reset-soft ainda não tem botão (API existe e foi testada).</p>
          <p>npm audit: 12 CVEs &quot;high&quot; vendored dentro do próprio next, sem fix não-breaking disponível.</p>
        </CardContent>
      </Card>
    </div>
  );
}

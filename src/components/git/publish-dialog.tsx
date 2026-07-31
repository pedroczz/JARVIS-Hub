"use client";

import { CheckCircle2, Rocket, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readSse } from "@/lib/sse-client";
import { cn } from "@/lib/utils";
import type { PublishStepResult } from "@/types/git";

export function PublishDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<PublishStepResult[]>([]);

  const publish = async () => {
    setRunning(true);
    setResults([]);
    try {
      const res = await fetch("/api/git/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, commitMessage: message }),
      });
      await readSse<PublishStepResult>(res, (event) => {
        setResults((prev) => [...prev, event]);
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Rocket /> Publicar projeto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publicar projeto</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          build → lint → test → auditoria → resumo → confirmação → commit → push. Para no
          primeiro passo que falhar; nunca dá push se os testes falharem.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="commit-message">Mensagem de commit</Label>
          <Input
            id="commit-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="feat: ..."
          />
        </div>
        <Button onClick={publish} disabled={running || !message.trim()}>
          {running ? "Publicando…" : "Confirmar e publicar"}
        </Button>
        {results.length > 0 && (
          <ul className="space-y-1.5 rounded-md border border-border p-3 text-sm">
            {results.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                {r.ok ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <div>
                  <p className="font-medium">{r.step}</p>
                  <p className={cn("whitespace-pre-wrap text-xs text-muted-foreground", !r.ok && "text-destructive")}>
                    {r.output}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

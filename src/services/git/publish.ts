import type { PublishStep, PublishStepResult } from "@/types/git";

import { runNpmScript } from "@/lib/exec-git";
import { commit, getStatus, push, stageAll } from "./operations";

export interface PublishOptions {
  cwd: string;
  commitMessage: string;
}

/**
 * Sequência do botão "Publicar Projeto": build → lint → test → auditoria →
 * resumo → commit → push. Para no primeiro passo que falhar — nunca faz
 * `git reset --hard` e nunca dá push se os testes (ou qualquer passo
 * anterior) falharam.
 */
export async function* publishProject(
  options: PublishOptions
): AsyncGenerator<PublishStepResult> {
  const { cwd, commitMessage } = options;

  const runStep = async (
    step: PublishStep,
    fn: () => Promise<string>
  ): Promise<PublishStepResult> => {
    try {
      const output = await fn();
      return { step, ok: true, output };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { step, ok: false, output: message };
    }
  };

  const build = await runStep("build", () => runNpmScript(cwd, "build"));
  yield build;
  if (!build.ok) return;

  const lint = await runStep("lint", () => runNpmScript(cwd, "lint"));
  yield lint;
  if (!lint.ok) return;

  const test = await runStep("test", () => runNpmScript(cwd, "test"));
  yield test;
  if (!test.ok) return;

  // Stub: auditoria real (npm audit / scanners de secret) fica para uma
  // fase futura — hoje só reporta "sem verificação automatizada" para não
  // dar falsa confiança de que algo foi checado.
  yield { step: "audit", ok: true, output: "Auditoria automatizada ainda não implementada." };

  const status = await getStatus(cwd);
  const summary =
    status.entries.length === 0
      ? "Nada para commitar — árvore de trabalho limpa."
      : status.entries.map((e) => `${e.index}${e.worktree} ${e.path}`).join("\n");
  yield { step: "summary", ok: true, output: summary };

  if (status.entries.length === 0) return;

  const commitResult = await runStep("commit", async () => {
    await stageAll(cwd);
    return commit(cwd, commitMessage);
  });
  yield commitResult;
  if (!commitResult.ok) return;

  const pushResult = await runStep("push", () => push(cwd));
  yield pushResult;
}

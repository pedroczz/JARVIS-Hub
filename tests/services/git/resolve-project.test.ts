import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import { GitError } from "@/lib/exec-git";
import { runGitOrError } from "@/services/git/resolve-project";

describe("runGitOrError", () => {
  it("mapeia 'not a git repository' pra 409 com mensagem amigável", async () => {
    const result = await runGitOrError(() => {
      throw new GitError("Command failed", "fatal: not a git repository (or any of the parent directories): .git\n");
    });

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(409);
    const body = await (result as NextResponse).json();
    expect(body.error).toBe("Este projeto ainda não é um repositório git.");
  });

  it("mapeia outros GitError pra 400 com o stderr original", async () => {
    const result = await runGitOrError(() => {
      throw new GitError("Command failed", "fatal: branch 'x' not found\n");
    });

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(400);
    const body = await (result as NextResponse).json();
    expect(body.error).toContain("branch 'x' not found");
  });

  it("deixa passar o valor de sucesso sem embrulhar", async () => {
    const result = await runGitOrError(async () => ({ ok: true }));
    expect(result).toEqual({ ok: true });
  });

  it("relança erros que não são GitError", async () => {
    await expect(
      runGitOrError(() => {
        throw new TypeError("bug de verdade");
      })
    ).rejects.toThrow("bug de verdade");
  });
});

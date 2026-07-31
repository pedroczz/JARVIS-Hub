import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { GitError, runGit } from "@/lib/exec-git";

describe("runGit", () => {
  let repoDir: string;

  beforeAll(() => {
    repoDir = mkdtempSync(join(tmpdir(), "jarvis-exec-git-"));
    execFileSync("git", ["init"], { cwd: repoDir });
    execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: repoDir });
    execFileSync("git", ["config", "user.name", "Test"], { cwd: repoDir });
    writeFileSync(join(repoDir, "file.txt"), "conteúdo\n");
    execFileSync("git", ["add", "-A"], { cwd: repoDir });
    execFileSync("git", ["commit", "-m", "primeiro commit"], { cwd: repoDir });
  });

  afterAll(() => {
    rmSync(repoDir, { recursive: true, force: true });
  });

  it("roda um comando git real e retorna stdout limpo", async () => {
    const out = await runGit(repoDir, ["log", "--pretty=format:%s"]);
    expect(out).toBe("primeiro commit");
  });

  it("lança GitError com stderr populado quando o comando falha", async () => {
    await expect(runGit(repoDir, ["checkout", "branch-que-nao-existe"])).rejects.toBeInstanceOf(GitError);

    try {
      await runGit(repoDir, ["checkout", "branch-que-nao-existe"]);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(GitError);
      expect((err as GitError).stderr.length).toBeGreaterThan(0);
    }
  });
});

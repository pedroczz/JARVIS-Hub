import { runGit } from "@/lib/exec-git";
import type { GitBranch, GitLogEntry, GitRemote, GitStatus, GitStatusEntry } from "@/types/git";

export async function initRepo(cwd: string): Promise<string> {
  return runGit(cwd, ["init", "-b", "main"]);
}

export async function getStatus(cwd: string): Promise<GitStatus> {
  const [branchOut, statusOut] = await Promise.all([
    runGit(cwd, ["status", "--branch", "--porcelain=v2"]),
    runGit(cwd, ["status", "--porcelain=v1"]),
  ]);

  let branch = "HEAD";
  let ahead = 0;
  let behind = 0;

  for (const line of branchOut.split("\n")) {
    if (line.startsWith("# branch.head")) branch = line.split(" ")[2] ?? branch;
    if (line.startsWith("# branch.ab")) {
      const match = /# branch.ab \+(\d+) -(\d+)/.exec(line);
      if (match) {
        ahead = Number(match[1]);
        behind = Number(match[2]);
      }
    }
  }

  const entries: GitStatusEntry[] = statusOut
    .split("\n")
    .filter(Boolean)
    .map((line) => ({
      index: line[0] ?? " ",
      worktree: line[1] ?? " ",
      path: line.slice(3),
    }));

  return { branch, ahead, behind, entries };
}

export async function getLog(cwd: string, limit = 30): Promise<GitLogEntry[]> {
  const format = "%H%x1f%an%x1f%ad%x1f%s%x1e";
  const out = await runGit(cwd, [
    "log",
    `--max-count=${limit}`,
    `--date=iso-strict`,
    `--pretty=format:${format}`,
  ]);

  return out
    .split("\x1e")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [hash, author, date, message] = entry.split("\x1f");
      return { hash: hash ?? "", author: author ?? "", date: date ?? "", message: message ?? "" };
    });
}

export async function getDiff(cwd: string, path?: string): Promise<string> {
  const args = ["diff"];
  if (path) args.push("--", path);
  return runGit(cwd, args);
}

export async function getBranches(cwd: string): Promise<GitBranch[]> {
  const out = await runGit(cwd, ["branch", "--all", "--format=%(refname:short)%09%(HEAD)"]);
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, head] = line.split("\t");
      return {
        name: name ?? "",
        current: head === "*",
        remote: (name ?? "").startsWith("remotes/"),
      };
    });
}

export async function checkoutBranch(cwd: string, branch: string): Promise<void> {
  await runGit(cwd, ["checkout", branch]);
}

export async function stageAll(cwd: string): Promise<void> {
  await runGit(cwd, ["add", "-A"]);
}

export async function commit(cwd: string, message: string): Promise<string> {
  return runGit(cwd, ["commit", "-m", message]);
}

export async function push(cwd: string): Promise<string> {
  return runGit(cwd, ["push"]);
}

export async function pull(cwd: string): Promise<string> {
  return runGit(cwd, ["pull", "--ff-only"]);
}

export async function getRemotes(cwd: string): Promise<GitRemote[]> {
  const out = await runGit(cwd, ["remote", "-v"]);
  const seen = new Map<string, string>();
  for (const line of out.split("\n").filter(Boolean)) {
    const [name, urlAndType] = line.split("\t");
    const url = (urlAndType ?? "").replace(/\s+\((fetch|push)\)$/, "");
    if (name) seen.set(name, url);
  }
  return Array.from(seen, ([name, url]) => ({ name, url }));
}

export async function stashSave(cwd: string, message?: string): Promise<string> {
  const args = ["stash", "push"];
  if (message) args.push("-m", message);
  return runGit(cwd, args);
}

export async function stashList(cwd: string): Promise<string[]> {
  const out = await runGit(cwd, ["stash", "list"]);
  return out.split("\n").filter(Boolean);
}

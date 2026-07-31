export interface GitStatusEntry {
  path: string;
  index: string;
  worktree: string;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  entries: GitStatusEntry[];
}

export interface GitLogEntry {
  hash: string;
  author: string;
  date: string;
  message: string;
}

export interface GitBranch {
  name: string;
  current: boolean;
  remote: boolean;
}

export interface GitRemote {
  name: string;
  url: string;
}

export type PublishStep =
  | "build"
  | "lint"
  | "test"
  | "audit"
  | "summary"
  | "commit"
  | "push";

export interface PublishStepResult {
  step: PublishStep;
  ok: boolean;
  output: string;
}

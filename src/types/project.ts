import type { ProjectPermissions } from "./permissions";

export type Framework =
  | "next"
  | "react"
  | "vue"
  | "node"
  | "python"
  | "rust"
  | "go"
  | "unknown";

export interface ProjectDetection {
  framework: Framework;
  hasGit: boolean;
  packageManager: "npm" | "pnpm" | "yarn" | "bun" | null;
  dependencyCount: number;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  permissions: ProjectPermissions;
  detection: ProjectDetection | null;
  connectedAt: string;
}

/** Formato persistido em ~/.jarvis/registry.json, fora de qualquer repo. */
export interface Registry {
  version: 1;
  projects: Project[];
}

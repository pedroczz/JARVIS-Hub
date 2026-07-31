import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import type { Framework, ProjectDetection } from "@/types/project";

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function detectFramework(pkg: Record<string, unknown> | null): Framework {
  const deps = {
    ...(pkg?.dependencies as Record<string, string> | undefined),
    ...(pkg?.devDependencies as Record<string, string> | undefined),
  };

  if (deps.next) return "next";
  if (deps.react) return "react";
  if (deps.vue) return "vue";
  if (deps) return pkg ? "node" : "unknown";
  return "unknown";
}

async function detectPackageManager(
  projectPath: string
): Promise<ProjectDetection["packageManager"]> {
  if (await exists(path.join(projectPath, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(path.join(projectPath, "yarn.lock"))) return "yarn";
  if (await exists(path.join(projectPath, "bun.lockb"))) return "bun";
  if (await exists(path.join(projectPath, "package-lock.json"))) return "npm";
  return null;
}

export async function detectProject(projectPath: string): Promise<ProjectDetection> {
  const packageJsonPath = path.join(projectPath, "package.json");
  const hasGit = await exists(path.join(projectPath, ".git"));

  let pkg: Record<string, unknown> | null = null;
  let dependencyCount = 0;

  if (await exists(packageJsonPath)) {
    try {
      pkg = JSON.parse(await readFile(packageJsonPath, "utf-8"));
      const deps = pkg?.dependencies as Record<string, string> | undefined;
      const devDeps = pkg?.devDependencies as Record<string, string> | undefined;
      dependencyCount = Object.keys({ ...deps, ...devDeps }).length;
    } catch {
      pkg = null;
    }
  }

  let framework = detectFramework(pkg);
  if (framework === "unknown" && !pkg) {
    if (await exists(path.join(projectPath, "Cargo.toml"))) framework = "rust";
    else if (await exists(path.join(projectPath, "go.mod"))) framework = "go";
    else if (await exists(path.join(projectPath, "pyproject.toml"))) framework = "python";
    else if (await exists(path.join(projectPath, "requirements.txt"))) framework = "python";
  }

  return {
    framework,
    hasGit,
    packageManager: await detectPackageManager(projectPath),
    dependencyCount,
  };
}

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

import { DEFAULT_PERMISSIONS } from "@/types/permissions";
import type { Project, ProjectDetection, Registry } from "@/types/project";
import type { ProjectPermissions } from "@/types/permissions";

/**
 * O registry vive fora de qualquer repositório (~/.jarvis/registry.json),
 * de propósito: o Jarvis nunca deve versionar caminhos/segredos locais do
 * usuário dentro do repo de um projeto conectado, nem do próprio Jarvis.
 */
const JARVIS_HOME = path.join(homedir(), ".jarvis");
const REGISTRY_PATH = path.join(JARVIS_HOME, "registry.json");

async function ensureRegistryFile(): Promise<void> {
  await mkdir(JARVIS_HOME, { recursive: true });
  try {
    await readFile(REGISTRY_PATH, "utf-8");
  } catch {
    const empty: Registry = { version: 1, projects: [] };
    await writeFile(REGISTRY_PATH, JSON.stringify(empty, null, 2), "utf-8");
  }
}

export async function readRegistry(): Promise<Registry> {
  await ensureRegistryFile();
  const raw = await readFile(REGISTRY_PATH, "utf-8");
  return JSON.parse(raw) as Registry;
}

async function writeRegistry(registry: Registry): Promise<void> {
  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");
}

export async function listProjects(): Promise<Project[]> {
  const registry = await readRegistry();
  return registry.projects;
}

export async function connectProject(
  projectPath: string,
  name: string,
  detection: ProjectDetection | null
): Promise<Project> {
  const registry = await readRegistry();

  const existing = registry.projects.find((p) => p.path === projectPath);
  if (existing) return existing;

  const project: Project = {
    id: randomUUID(),
    name,
    path: projectPath,
    permissions: { ...DEFAULT_PERMISSIONS },
    detection,
    connectedAt: new Date().toISOString(),
  };

  registry.projects.push(project);
  await writeRegistry(registry);
  return project;
}

export async function disconnectProject(id: string): Promise<void> {
  const registry = await readRegistry();
  registry.projects = registry.projects.filter((p) => p.id !== id);
  await writeRegistry(registry);
}

export async function updateProjectPermissions(
  id: string,
  permissions: ProjectPermissions
): Promise<Project | null> {
  const registry = await readRegistry();
  const project = registry.projects.find((p) => p.id === id);
  if (!project) return null;

  project.permissions = permissions;
  await writeRegistry(registry);
  return project;
}

export async function getProject(id: string): Promise<Project | null> {
  const registry = await readRegistry();
  return registry.projects.find((p) => p.id === id) ?? null;
}

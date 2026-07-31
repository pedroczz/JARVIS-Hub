import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const MEMORY_FILES = [
  "PROJECT_STATE.md",
  "BACKLOG.md",
  "ROADMAP.md",
  "CHANGELOG.md",
  "ADR.md",
  "TECH_DEBT.md",
] as const;

export type MemoryFileName = (typeof MEMORY_FILES)[number];

/**
 * Memória por projeto vive dentro do próprio projeto (<projeto>/.jarvis/memory/),
 * nunca copiada para o Jarvis e nunca compartilhada entre projetos — cada
 * projeto conectado tem seu próprio histórico isolado.
 */
function memoryDir(projectPath: string): string {
  return path.join(projectPath, ".jarvis", "memory");
}

function templateFor(file: MemoryFileName, projectName: string): string {
  const header = `# ${file.replace(".md", "")} — ${projectName}\n\n`;
  switch (file) {
    case "PROJECT_STATE.md":
      return `${header}_Estado atual do projeto. Atualizado pelo Jarvis a cada sessão relevante._\n`;
    case "BACKLOG.md":
      return `${header}_Itens pendentes, não priorizados._\n`;
    case "ROADMAP.md":
      return `${header}_Direção de médio/longo prazo._\n`;
    case "CHANGELOG.md":
      return `${header}_Mudanças notáveis, mais recente no topo._\n`;
    case "ADR.md":
      return `${header}_Architecture Decision Records — decisões e o porquê._\n`;
    case "TECH_DEBT.md":
      return `${header}_Débito técnico conhecido e seu impacto._\n`;
  }
}

export async function ensureMemory(
  projectPath: string,
  projectName: string
): Promise<void> {
  const dir = memoryDir(projectPath);
  await mkdir(dir, { recursive: true });

  for (const file of MEMORY_FILES) {
    const filePath = path.join(dir, file);
    try {
      await readFile(filePath, "utf-8");
    } catch {
      await writeFile(filePath, templateFor(file, projectName), "utf-8");
    }
  }
}

export async function readMemoryFile(
  projectPath: string,
  file: MemoryFileName
): Promise<string> {
  const filePath = path.join(memoryDir(projectPath), file);
  return readFile(filePath, "utf-8");
}

export async function writeMemoryFile(
  projectPath: string,
  file: MemoryFileName,
  content: string
): Promise<void> {
  const filePath = path.join(memoryDir(projectPath), file);
  await writeFile(filePath, content, "utf-8");
}

export async function readAllMemory(
  projectPath: string
): Promise<Record<MemoryFileName, string>> {
  const entries = await Promise.all(
    MEMORY_FILES.map(async (file) => [file, await readMemoryFile(projectPath, file)] as const)
  );
  return Object.fromEntries(entries) as Record<MemoryFileName, string>;
}

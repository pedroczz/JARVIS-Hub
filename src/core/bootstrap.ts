import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { readRegistry } from "@/services/registry";

import { registerModule, validateDependencies } from "./registry";
import type { HealthResult } from "./types";

const execFileAsync = promisify(execFile);

const CLAUDE_BIN = process.env.CLAUDE_CLI_PATH?.trim() || "claude";

async function checkBinary(bin: string, args: string[]): Promise<HealthResult> {
  try {
    await execFileAsync(bin, args, { windowsHide: true, timeout: 5000 });
    return { state: "healthy" };
  } catch (err) {
    return { state: "down", detail: err instanceof Error ? err.message : String(err) };
  }
}

let bootstrapped = false;

/**
 * Registra os módulos que hoje já existem como services/ soltos. Não muda
 * como eles são chamados (rotas continuam importando os services
 * diretamente) — só dá visibilidade/health check centralizados. Idempotente
 * de propósito: em dev, o Next.js recompila módulos a cada request.
 */
export function bootstrapCore(): void {
  if (bootstrapped) return;

  registerModule({
    name: "project-registry",
    version: "1.0.0",
    description: "Registry global de projetos conectados (~/.jarvis/registry.json).",
    health: async (): Promise<HealthResult> => {
      try {
        await readRegistry();
        return { state: "healthy" };
      } catch (err) {
        return { state: "down", detail: err instanceof Error ? err.message : String(err) };
      }
    },
  });

  registerModule({
    name: "memory",
    version: "1.0.0",
    description: "Memória isolada por projeto (<projeto>/.jarvis/memory/).",
  });

  registerModule({
    name: "git",
    version: "1.0.0",
    description: "Wrapper local do Git CLI (execFile, nunca shell).",
    health: () => checkBinary("git", ["--version"]),
  });

  registerModule({
    name: "claude-cli",
    version: "1.0.0",
    description: "Invocação da Claude Code CLI local via child_process.",
    health: () => checkBinary(CLAUDE_BIN, ["--version"]),
  });

  validateDependencies();
  bootstrapped = true;
}

import { listModules } from "./registry";
import type { ModuleHealthReport } from "./types";

/**
 * Roda o health() de cada módulo registrado (quando existir) e agrega o
 * resultado. Um módulo sem health() é reportado "healthy" — a ausência
 * de verificação não é um problema por si só.
 */
export async function runHealthChecks(): Promise<ModuleHealthReport[]> {
  return Promise.all(
    listModules().map(async (mod): Promise<ModuleHealthReport> => {
      if (!mod.health) {
        return { module: mod.name, state: "healthy" };
      }
      try {
        const result = await mod.health();
        return { module: mod.name, ...result };
      } catch (err) {
        return {
          module: mod.name,
          state: "down",
          detail: err instanceof Error ? err.message : String(err),
        };
      }
    })
  );
}

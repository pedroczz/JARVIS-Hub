import { beforeEach, describe, expect, it } from "vitest";

import { runHealthChecks } from "@/core/health";
import { __resetRegistryForTests, registerModule } from "@/core/registry";

describe("core/health", () => {
  beforeEach(() => {
    __resetRegistryForTests();
  });

  it("reporta healthy pra módulo sem health()", async () => {
    registerModule({ name: "memory", version: "1.0.0", description: "sem check" });
    const [report] = await runHealthChecks();
    expect(report).toEqual({ module: "memory", state: "healthy" });
  });

  it("propaga o resultado do health() do módulo", async () => {
    registerModule({
      name: "git",
      version: "1.0.0",
      description: "git",
      health: () => ({ state: "down", detail: "git não encontrado" }),
    });
    const [report] = await runHealthChecks();
    expect(report).toEqual({ module: "git", state: "down", detail: "git não encontrado" });
  });

  it("captura exceção do health() como state down", async () => {
    registerModule({
      name: "claude-cli",
      version: "1.0.0",
      description: "cli",
      health: () => {
        throw new Error("spawn ENOENT");
      },
    });
    const reports = await runHealthChecks();
    expect(reports).toHaveLength(1);
    expect(reports[0]?.module).toBe("claude-cli");
    expect(reports[0]?.state).toBe("down");
    expect(reports[0]?.detail).toContain("ENOENT");
  });
});

import { beforeEach, describe, expect, it } from "vitest";

import { __resetRegistryForTests, getModule, listModules, registerModule, validateDependencies } from "@/core/registry";

describe("core/registry", () => {
  beforeEach(() => {
    __resetRegistryForTests();
  });

  it("registra e recupera um módulo", () => {
    registerModule({ name: "git", version: "1.0.0", description: "Git wrapper" });
    expect(getModule("git")?.description).toBe("Git wrapper");
    expect(listModules()).toHaveLength(1);
  });

  it("rejeita nome vazio", () => {
    expect(() => registerModule({ name: "", version: "1.0.0", description: "x" })).toThrow();
  });

  it("valida dependências existentes sem lançar", () => {
    registerModule({ name: "core", version: "1.0.0", description: "core" });
    registerModule({ name: "git", version: "1.0.0", description: "git", dependencies: ["core"] });
    expect(() => validateDependencies()).not.toThrow();
  });

  it("lança quando uma dependência não está registrada", () => {
    registerModule({ name: "git", version: "1.0.0", description: "git", dependencies: ["core"] });
    expect(() => validateDependencies()).toThrow(/depende de "core"/);
  });

  it("detecta dependência circular direta (A -> B -> A)", () => {
    registerModule({ name: "a", version: "1.0.0", description: "a", dependencies: ["b"] });
    registerModule({ name: "b", version: "1.0.0", description: "b", dependencies: ["a"] });
    expect(() => validateDependencies()).toThrow(/circular/i);
  });

  it("detecta dependência circular indireta (A -> B -> C -> A)", () => {
    registerModule({ name: "a", version: "1.0.0", description: "a", dependencies: ["b"] });
    registerModule({ name: "b", version: "1.0.0", description: "b", dependencies: ["c"] });
    registerModule({ name: "c", version: "1.0.0", description: "c", dependencies: ["a"] });
    expect(() => validateDependencies()).toThrow(/circular/i);
  });
});

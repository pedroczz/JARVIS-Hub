import { describe, expect, it } from "vitest";

import { DEFAULT_PERMISSIONS, hasWriteAccess } from "@/types/permissions";

describe("hasWriteAccess", () => {
  it("é false com as permissões default (só leitura + análise)", () => {
    expect(hasWriteAccess(DEFAULT_PERMISSIONS)).toBe(false);
  });

  it("é true quando implement está ligado", () => {
    expect(hasWriteAccess({ ...DEFAULT_PERMISSIONS, implement: true })).toBe(true);
  });

  it("é true quando refactor está ligado", () => {
    expect(hasWriteAccess({ ...DEFAULT_PERMISSIONS, refactor: true })).toBe(true);
  });

  it("ignora as demais permissões (test/build/git/push/deploy não destravam a CLI)", () => {
    expect(
      hasWriteAccess({
        ...DEFAULT_PERMISSIONS,
        test: true,
        build: true,
        git: true,
        push: true,
        deploy: true,
      })
    ).toBe(false);
  });
});

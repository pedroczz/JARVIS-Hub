import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { detectProject } from "@/services/detect";

describe("detectProject", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "jarvis-detect-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("detecta Next.js + npm a partir de package.json e package-lock.json", async () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0", react: "19.0.0" }, devDependencies: { typescript: "5.0.0" } })
    );
    writeFileSync(join(dir, "package-lock.json"), "{}");

    const detection = await detectProject(dir);

    expect(detection.framework).toBe("next");
    expect(detection.packageManager).toBe("npm");
    expect(detection.dependencyCount).toBe(3); // 2 dependencies + 1 devDependency
    expect(detection.hasGit).toBe(false);
  });

  it("detecta pasta sem package.json como unknown, sem quebrar", async () => {
    const detection = await detectProject(dir);
    expect(detection.framework).toBe("unknown");
    expect(detection.packageManager).toBeNull();
    expect(detection.dependencyCount).toBe(0);
  });

  it("detecta .git presente", async () => {
    mkdirSync(join(dir, ".git"));
    const detection = await detectProject(dir);
    expect(detection.hasGit).toBe(true);
  });

  it("detecta pnpm pelo lockfile quando não há package-lock.json", async () => {
    writeFileSync(join(dir, "package.json"), JSON.stringify({ dependencies: { react: "19.0.0" } }));
    writeFileSync(join(dir, "pnpm-lock.yaml"), "");

    const detection = await detectProject(dir);
    expect(detection.packageManager).toBe("pnpm");
    expect(detection.framework).toBe("react");
  });
});

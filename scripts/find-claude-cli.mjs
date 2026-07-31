#!/usr/bin/env node
// Resolve a lacuna documentada em .jarvis/memory/TECH_DEBT.md: descoberta do
// binário `claude` era 100% manual. Procura nos lugares mais comuns e,
// com --write, grava CLAUDE_CLI_PATH em .env.local automaticamente.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const isWindows = process.platform === "win32";
const binName = isWindows ? "claude.exe" : "claude";

function isOnPath() {
  try {
    execFileSync("claude", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Extensões do VS Code embutem o binário nativo em resources/native-binary/. */
function findInVscodeExtensions() {
  const editions = [".vscode", ".vscode-insiders"];
  const found = [];

  for (const edition of editions) {
    const extensionsDir = join(homedir(), edition, "extensions");
    if (!existsSync(extensionsDir)) continue;

    for (const entry of readdirSync(extensionsDir)) {
      if (!entry.startsWith("anthropic.claude-code-")) continue;
      const candidate = join(extensionsDir, entry, "resources", "native-binary", binName);
      if (existsSync(candidate)) found.push(candidate);
    }
  }

  // Mais recente por nome de pasta (a versão vai no nome) primeiro.
  return found.sort().reverse();
}

function main() {
  const shouldWrite = process.argv.includes("--write");

  if (isOnPath()) {
    console.log('"claude" já está no PATH — nenhuma configuração adicional necessária.');
    return;
  }

  const candidates = findInVscodeExtensions();
  if (candidates.length === 0) {
    console.error(
      "Não encontrei o binário da Claude Code CLI (nem no PATH, nem em extensões do VS Code).\n" +
        "Instale a CLI ou a extensão anthropic.claude-code, ou informe o caminho manualmente em CLAUDE_CLI_PATH no .env.local."
    );
    process.exitCode = 1;
    return;
  }

  const best = candidates[0];
  console.log(`Encontrado: ${best}`);
  if (candidates.length > 1) {
    console.log(`(${candidates.length - 1} outra(s) versão(ões) também instalada(s), usando a mais recente por nome de pasta.)`);
  }

  if (!shouldWrite) {
    console.log("\nRode com --write para gravar automaticamente em .env.local, ou adicione manualmente:");
    console.log(`CLAUDE_CLI_PATH=${best.replace(/\\/g, "/")}`);
    return;
  }

  const envPath = join(process.cwd(), ".env.local");
  const line = `CLAUDE_CLI_PATH=${best.replace(/\\/g, "/")}`;
  const existing = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";
  const withoutOldLine = existing
    .split("\n")
    .filter((l) => !l.startsWith("CLAUDE_CLI_PATH="))
    .join("\n")
    .trimEnd();

  const next = (withoutOldLine ? `${withoutOldLine}\n${line}\n` : `${line}\n`);
  writeFileSync(envPath, next, "utf-8");
  console.log(`Gravado em ${envPath}. Reinicie "npm run dev" para carregar.`);
}

main();

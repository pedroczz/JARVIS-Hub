import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export class GitError extends Error {
  constructor(message: string, public readonly stderr: string) {
    super(message);
    this.name = "GitError";
  }
}

/**
 * Toda operação de git passa por aqui: sempre `execFile` com args em array,
 * nunca `exec`/shell string — elimina injeção via nome de branch, mensagem
 * de commit, etc. Funciona igual com GitHub, GitLab, Bitbucket ou nenhum
 * remoto: é só o Git CLI local, nunca uma API de plataforma.
 */
export async function runGit(cwd: string, args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", args, { cwd, windowsHide: true });
    return stdout.trim();
  } catch (err) {
    const execErr = err as { stderr?: string; message: string };
    throw new GitError(execErr.message, execErr.stderr ?? "");
  }
}

export async function runNpmScript(cwd: string, script: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("npm", ["run", script], {
      cwd,
      windowsHide: true,
      shell: process.platform === "win32",
    });
    return stdout.trim();
  } catch (err) {
    const execErr = err as { stdout?: string; stderr?: string; message: string };
    throw new GitError(execErr.message, execErr.stderr ?? execErr.stdout ?? "");
  }
}

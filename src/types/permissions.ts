export interface ProjectPermissions {
  readOnly: boolean;
  analyze: boolean;
  document: boolean;
  implement: boolean;
  refactor: boolean;
  test: boolean;
  build: boolean;
  git: boolean;
  push: boolean;
  deploy: boolean;
}

export const PERMISSION_KEYS: (keyof ProjectPermissions)[] = [
  "readOnly",
  "analyze",
  "document",
  "implement",
  "refactor",
  "test",
  "build",
  "git",
  "push",
  "deploy",
];

export const PERMISSION_LABELS: Record<keyof ProjectPermissions, string> = {
  readOnly: "Somente leitura",
  analyze: "Analisar",
  document: "Documentar",
  implement: "Implementar",
  refactor: "Refatorar",
  test: "Testar",
  build: "Build",
  git: "Git (commit local)",
  push: "Push remoto",
  deploy: "Deploy",
};

/** Default seguro: só leitura + análise. Tudo que escreve código ou o repo começa desligado. */
export const DEFAULT_PERMISSIONS: ProjectPermissions = {
  readOnly: true,
  analyze: true,
  document: false,
  implement: false,
  refactor: false,
  test: false,
  build: false,
  git: false,
  push: false,
  deploy: false,
};

/**
 * A CLI só sai do --permission-mode plan quando o projeto tem permissão de
 * fato escrever código. As demais permissões (test/build/git/push/deploy)
 * controlam o que a UI expõe, não o modo da CLI.
 */
export function hasWriteAccess(permissions: ProjectPermissions): boolean {
  return permissions.implement || permissions.refactor;
}

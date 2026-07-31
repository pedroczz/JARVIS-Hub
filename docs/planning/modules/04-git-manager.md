# MODULE 04 — GIT MANAGER

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, PROJECT_MANAGER, WORKFLOW_ENGINE

---

# MISSÃO

Centralizar absolutamente toda operação relacionada ao Git. Nenhum outro módulo executa comandos Git diretamente — tudo passa pelo Git Manager.

# RESPONSABILIDADES

Inicializar repositórios, registrar remotes, gerenciar branches, commits, push, pull, fetch, merge, rebase, stash, tags, rollback, auditoria, validação, publicação, permissões. Nunca editar arquivos nem gerar código.

# ESTRUTURA

```
git/
  git-service.ts
  git-provider.ts
  git-validator.ts
  git-publisher.ts
  git-permissions.ts
  git-history.ts
  git-summary.ts
  git-hooks.ts
  git-health.ts
```

# REPOSITORY DETECTION / PROVIDERS

Ao abrir um projeto, detectar automaticamente `.git`, remote, owner, repository, provider, default branch, HEAD, branch atual, tags, submodules. Providers suportados: GitHub, GitLab, Bitbucket, Azure DevOps, repositório local — arquitetura preparada para novos.

# GIT INIT / REMOTES / BRANCHES

Init: se o projeto não tem Git, permitir inicializar + branch principal + remote + commit inicial — nunca automático, sempre com confirmação. Remotes: adicionar/editar/remover/trocar/validar/listar. Branches: criar/trocar/excluir/renomear/proteger/listar/detectar divergências.

# STATUS / DIFF / SAFE MODE

Status sempre resumido (arquivos alterados/novos/removidos/ignorados/conflitos), nunca texto cru. Diff gera resumo + impacto + linhas + arquivos afetados — nunca commit sem permitir revisão. Safe Mode: antes de qualquer commit, mostrar arquivos modificados, resumo, impacto, build/testes/lint/auditoria, e pedir confirmação.

# COMMIT

Fluxo: Validar → Build → Lint → Testes → Resumo → Mensagem → Commit. Nunca permitir commit quebrado. Mensagens seguem Conventional Commits (feat/fix/refactor/docs/test/style/build/ci/perf/chore), com opção de mensagem personalizada.

# PUSH / PULL / FETCH

Push: fetch → verificar conflitos → validar permissões → resumo → confirmação → push. Nunca force push sem autorização explícita. Pull: detectar conflitos/commits remotos/arquivos alterados antes, revalidar depois. Fetch sempre antes do push — nunca assumir que o repo está atualizado.

# MERGE / REBASE / STASH / TAGS / RELEASE

Merge: preview, resumo, conflitos, rollback. Rebase: só com autorização, sempre cria ponto de recuperação. Stash: criar/aplicar/excluir/nomear/listar. Tags: criar/excluir/listar, versionamento semântico. Release: gera release notes/resumo/arquivos/commits/mudanças automaticamente.

# PUBLICAÇÃO

Build → Lint → Testes → Auditoria → Commit → Push → Deploy → Confirmação.

# GIT HEALTH / PERMISSÕES / AUTH

Health valida remote, branch, HEAD, permissões, autenticação, conectividade, hooks. Cada projeto registra permissões granulares (commit/push/merge/delete branch/force push/reset/tag) — nunca assumidas. Auth via GitHub CLI/SSH/HTTPS/Credential Manager/tokens — nunca armazenados manualmente, sempre mecanismos seguros do SO.

# HISTORY / AUDITORIA / RESUMO

Busca por commit/autor/data/arquivo/branch/tag. Auditoria registra quem/quando/projeto/branch/resultado/tempo. Toda operação termina com resumo (resultado, arquivos, commits, branch, remote, tempo, próximo passo).

# EVENTOS PUBLICADOS

GitInitialized, RepositoryDetected, BranchChanged, CommitCreated, PushStarted, PushFinished, PushFailed, MergeStarted, MergeFinished, RepositoryUpdated, PermissionDenied.

# EVENTOS CONSUMIDOS

ProjectOpened, BuildFinished, TestsFinished, DeployRequested, PublishRequested, WorkflowApproved.

# API PÚBLICA

`init() status() summary() diff() commit() push() pull() fetch() merge() rebase() stash() tag() history() permissions() health() rollback() publish()`

# FAILURES

Se o push falhar: nunca perder alterações, registrar motivo, mostrar solução, permitir nova tentativa.

# DASHBOARD

Branch, último commit, último push/pull, ahead/behind, conflitos, alterações locais.

# SEGURANÇA

Nunca reset hard, force push ou delete branch sem confirmação explícita.

# FUTURO

GitHub Actions, GitLab CI, Azure Pipelines, release automático, code owners, signed commits, protected branches, pull requests.

# CRITÉRIO DE CONCLUSÃO

✔ Git Init · ✔ Repository Detection · ✔ Branch Manager · ✔ Commit/Push/Pull/Merge/Rebase/Stash/Tags · ✔ Safe Mode · ✔ Release Notes · ✔ Auditoria · ✔ Dashboard · ✔ Workflow · ✔ Eventos.

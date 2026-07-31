# PROJECT_STATE — Jarvis Development Hub

_Estado atual do projeto._

## Repositório

`pedroczz/JARVIS-Hub` (GitHub, público). Branch `main`. Push feito manualmente pelo mantenedor.

## Arquitetura

Feature-first + service layer (ver [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)): `app/` (rotas) · `features/{projects,chat,git,doctor}/` · `services/` (domínio) · `lib/exec-git.ts` (infra pura) · `core/` (registry de módulos + health, escopo MVP) · `store/` · `providers/` · `config/` · `utils/` · `types/`.

Visão de plataforma de longo prazo (Architecture v2, Roadmap v2, ~9 specs de módulo) está em [docs/planning/](../../docs/planning/) — referência, não implementada além do Core mínimo.

## O que está funcional

- **Home**: resumo de projetos conectados, permissões e limitações conhecidas.
- **Projetos**: conectar/desconectar (valida que o caminho existe antes), detecção automática de framework/git/gerenciador de pacotes, toggles de permissão por projeto.
- **Chat**: envia prompts para a Claude Code CLI local via `child_process.spawn`, streaming por SSE, **com memória real entre mensagens** (`--session-id`/`--resume`). System prompt condensado injetado via `--append-system-prompt`. Gate de `--permission-mode plan` testado no servidor.
- **Git**: status, histórico, branches, e fluxo "Publicar Projeto" via 12 rotas `/api/git/*` — erros esperados (projeto sem `.git`, etc.) retornam mensagem limpa em vez de 500.
- **Doctor**: saúde real dos módulos registrados no Core (`project-registry`, `memory`, `git`, `claude-cli`) via `/api/health`.

## O que é stub ("em breve")

Arquitetura, Componentes, Backlog, Roadmap, Memória, CTO, Documentação, Deploy, Configurações, Logs, Timeline — 11 módulos com rota e navegação prontas, sem lógica funcional.

## Limitações conhecidas

- Sem aprovação clique-a-clique antes de mudanças (Safe Mode completo) — só o gate binário de permissão (`implement`/`refactor` → plan mode).
- API de merge/rebase/stash/tag/reset-soft existe (`src/services/git/operations.ts`) mas sem botão na UI.
- `npm audit` aponta CVEs "high" vendored dentro do próprio `next`, sem fix não-breaking disponível — ver TECH_DEBT.md.
- `sessionId` do chat só sobrevive em memória do cliente — reload da página perde a referência (a sessão em si continua existindo no disco da CLI).

## Setup local

`npm install` → `npm run setup:cli` (auto-detecta o binário da Claude Code CLI e grava `.env.local`) → `npm run dev`.

# PROJECT_STATE — Jarvis Development Hub

_Estado atual do projeto._

## Repositório

`pedroczz/JARVIS-Hub` (GitHub, público). Branch `main`. Push ainda não realizado pela automação — feito manualmente pelo mantenedor.

## O que está funcional

- **Home**: resumo de projetos conectados, permissões e limitações conhecidas.
- **Projetos**: conectar/desconectar, detecção automática de framework/git/gerenciador de pacotes, toggles de permissão por projeto.
- **Chat**: envia prompts para a Claude Code CLI local via `child_process.spawn`, streaming por SSE. Gate de `--permission-mode plan` testado no servidor.
- **Git**: status, histórico, branches, e fluxo "Publicar Projeto" (build → lint → test → auditoria stub → resumo → commit → push) via 12 rotas `/api/git/*`.

## O que é stub ("em breve")

Arquitetura, Componentes, Backlog, Roadmap, Memória, Doctor, CTO, Documentação, Deploy, Configurações, Logs, Timeline — 12 módulos com rota e navegação prontas, sem lógica funcional.

## Limitações conhecidas

- Sem aprovação clique-a-clique antes de mudanças (Safe Mode completo) — só o gate binário de permissão (`implement`/`refactor` → plan mode).
- API de merge/rebase/stash/tag/reset-soft existe (`src/lib/git/operations.ts`) mas sem botão na UI.
- `npm audit` provavelmente aponta CVEs "high" vendored dentro do próprio `next`, sem fix não-breaking disponível — ver TECH_DEBT.md.

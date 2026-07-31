# CHANGELOG — Jarvis Development Hub

_Mudanças notáveis, mais recente no topo._

## 2026-07-31 (2)

- Refatoração feature-first + service layer + repository pattern: `src/lib/*` virou `services/` (domínio) + `lib/exec-git.ts` (infra pura); `components/{projects,chat,git}` viraram `features/{projects,chat,git}/components`; `stores/` → `store/`; novos `config/`, `utils/`, `providers/`.
- Chat ganhou memória real entre mensagens (`--session-id`/`--resume` da CLI) — antes cada mensagem era um processo `claude` isolado sem contexto da anterior.
- System prompt condensado (`src/config/agent-system-prompt.ts`) injetado via `--append-system-prompt` em toda chamada à CLI.
- `docs/MASTER_INSTRUCTIONS.md` + `CLAUDE.md` na raiz: regras de operação do Jarvis, tanto pra sessões trabalhando no próprio Jarvis Hub quanto (versão condensada) pro runtime.
- `scripts/find-claude-cli.mjs`: auto-detecção do binário da CLI (PATH ou extensão do VS Code), com `npm run setup:cli` gravando `.env.local`.
- Primeira suíte de testes reais (Vitest): `hasWriteAccess`, parsing do stream-json real da CLI, mapeamento de erros de git, detecção de framework — `npm test`.
- Ruído de avisos benignos da CLI (trust dialog, stdin) filtrado da bolha de chat.

## 2026-07-31

- Scaffold inicial do Next.js 15 + arquitetura multi-projeto (registry global, memória isolada por projeto, permissões por toggle).
- Módulos funcionais: Home, Projetos, Chat (streaming da Claude Code CLI via SSE), Git (12 rotas + fluxo de publicação).
- 12 módulos stub ("em breve") com navegação e rota prontas.
- Documentação inicial: README, ARCHITECTURE, ADRs 0001–0002.

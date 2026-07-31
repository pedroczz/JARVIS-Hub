# Jarvis Development Hub

Regras completas de operação: [docs/MASTER_INSTRUCTIONS.md](docs/MASTER_INSTRUCTIONS.md) — leia antes de qualquer implementação.

Resumo operacional para trabalhar neste repositório:

- Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4. Sem dependências de API paga — ver [docs/ADR/0001-no-remote-api.md](docs/ADR/0001-no-remote-api.md).
- Arquitetura: feature-first + service layer + repository pattern. Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para onde cada tipo de código mora (`features/`, `services/`, `hooks/`, `store/`, `config/`, `utils/`).
- Antes de considerar qualquer tarefa concluída: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`.
- Nunca `git push` sem autorização explícita. Nunca `reset --hard`/force-push.
- Memória do projeto: [.jarvis/memory/](.jarvis/memory/) (`PROJECT_STATE`, `BACKLOG`, `ROADMAP`, `CHANGELOG`, `ADR`, `TECH_DEBT`) — sempre atualizar ao concluir algo relevante.

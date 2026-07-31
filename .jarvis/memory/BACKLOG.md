# BACKLOG — Jarvis Development Hub

_Itens pendentes, não priorizados._

- Botões de UI para merge/rebase/stash/tag/reset-soft (a API já existe em `src/services/git/operations.ts`).
- Safe Mode completo: aprovação clique-a-clique de cada mudança proposta pela CLI (Fase 10 do `docs/planning/ROADMAP_V2.md`), não só o gate binário de permissão atual.
- Implementar de fato os 11 módulos ainda em stub (Doctor saiu da lista — ver `.jarvis/memory/CHANGELOG.md`): Arquitetura, Componentes, Backlog, Roadmap, Memória, CTO, Documentação, Deploy, Configurações, Logs, Timeline.
- Auditoria real no fluxo de "Publicar Projeto" (hoje é um stub que só informa que não há verificação automatizada).
- Persistir `sessionId` do chat em algo além de memória do cliente (localStorage?) — hoje sobrevive a mensagens seguidas mas não a um reload da página.
- Detecção de framework mais ampla em `src/services/detect.ts` (hoje cobre Next/React/Vue/Node/Rust/Go/Python de forma heurística).
- Migrar os services restantes (registry/memory/detect) pra registrar `health()` mais específico no Core (hoje só `git`/`claude-cli`/`project-registry` têm checagem real).
- Próximos módulos do roadmap v2 (`docs/planning/`), na ordem: Project Manager → Memory Manager → Git Manager → AI Engine → Workflow Engine — sempre MVP-scoped, sem event bus/service container até haver necessidade real.

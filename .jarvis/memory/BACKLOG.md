# BACKLOG — Jarvis Development Hub

_Itens pendentes, não priorizados._

- Botões de UI para merge/rebase/stash/tag/reset-soft (a API já existe em `src/lib/git/operations.ts`).
- Safe Mode completo: aprovação clique-a-clique de cada mudança proposta pela CLI, não só o gate binário de permissão atual.
- Implementar de fato os 12 módulos hoje em stub (Arquitetura, Componentes, Backlog, Roadmap, Memória, Doctor, CTO, Documentação, Deploy, Configurações, Logs, Timeline).
- Auditoria real no fluxo de "Publicar Projeto" (hoje é um stub que só informa que não há verificação automatizada).
- Persistir histórico de chat por projeto (hoje é descartado ao trocar de projeto ou recarregar a página).
- Detecção de framework mais ampla em `src/lib/detect.ts` (hoje cobre Next/React/Vue/Node/Rust/Go/Python de forma heurística).

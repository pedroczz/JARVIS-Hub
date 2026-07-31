# Arquitetura

Ver também [MASTER_INSTRUCTIONS.md](MASTER_INSTRUCTIONS.md) (filosofia/regras) e [ARCHITECTURE_V2.md](ARCHITECTURE_V2.md) (visão de plataforma de longo prazo — ainda não implementada, ver seção final).

## Objetivo

Dashboard local para operar a Claude Code CLI por linguagem natural, sem depender de nenhuma API paga. Todo processamento de IA acontece via processo local (`claude` CLI); o Next.js é só a casca de UI + orquestração.

## Organização de pastas (feature-first + service layer)

```
src/
  app/          rotas Next.js (App Router) — só composição de página + chamada a services/hooks
  features/     UI + hooks específicos de um domínio (projects, chat, git)
  components/   UI genérica, sem conhecimento de domínio: ui/ (atoms) e layout/ (chrome do app)
  services/     lógica de domínio/aplicação (registry, memory, detect, claude-cli, git/*)
  lib/          infraestrutura pura, sem regra de negócio (hoje: exec-git.ts — wrapper de execFile)
  store/        estado global de cliente (Zustand)
  providers/    providers React (React Query)
  config/       configuração/constantes (nav, system prompt)
  utils/        helpers genéricos sem estado (cn, leitura de SSE)
  types/        tipos de domínio compartilhados entre app/features/services
tests/          espelha a estrutura de src/, um teste real por peça de lógica não-trivial
scripts/        utilitários de linha de comando (ex.: auto-detecção do binário da CLI)
```

A distinção `services/` vs `lib/`: `services/` conhece o domínio do Jarvis (projeto, permissão, memória, git); `lib/` não sabe nada disso — é só a primitiva de infraestrutura (rodar um processo) que os services usam por baixo.

## Multi-projeto, nunca acoplado a um projeto só

O Jarvis Hub nunca assume que existe "o projeto atual" fixo no filesystem dele mesmo. Todo estado de "quais projetos existem" e "o que cada um pode fazer" vive em dois lugares, propositalmente separados:

1. **Registry global** — `~/.jarvis/registry.json` (ou `$JARVIS_HOME_DIR/registry.json` em testes), fora de qualquer repositório git. Lista os projetos conectados: `id`, `name`, `path`, `permissions`, `detection`. Gerenciado por [src/services/registry.ts](../src/services/registry.ts).
2. **Memória por projeto** — `<projeto>/.jarvis/memory/*.md`, dentro do próprio repositório do projeto conectado. Nunca copiada para dentro do Jarvis Hub, nunca compartilhada entre projetos. Gerenciada por [src/services/memory.ts](../src/services/memory.ts).

Conectar um projeto valida que o caminho existe antes de criar qualquer coisa ([src/app/api/projects/route.ts](../src/app/api/projects/route.ts)) — sem isso, apontar pra um caminho inexistente criava silenciosamente uma pasta fantasma via `mkdir` recursivo.

## Seleção de projeto e isolamento de sessão

O seletor de projeto (topo da UI, [src/features/projects/components/project-selector.tsx](../src/features/projects/components/project-selector.tsx)) escreve o `activeProjectId` em `useProjectStore` (Zustand). Trocar de projeto chama `useChatStore.reset()` — histórico de chat E sessionId da CLI do projeto anterior são descartados, nunca reaproveitados.

## Permissões (10 toggles)

`readOnly`, `analyze`, `document`, `implement`, `refactor`, `test`, `build`, `git`, `push`, `deploy` — ver [src/types/permissions.ts](../src/types/permissions.ts). Default seguro: só `readOnly` + `analyze` ligados.

A única permissão que realmente muda o comportamento da CLI é a combinação `implement`/`refactor` (`hasWriteAccess`): sem ela, toda chamada ao chat força `--permission-mode plan` no servidor ([src/app/api/chat/route.ts](../src/app/api/chat/route.ts)) — a CLI planeja mas nunca executa. As demais permissões (`test`, `build`, `git`, `push`, `deploy`) gateiam rotas específicas de `/api/git/*`, não o modo da CLI.

## Integração com a Claude Code CLI

[src/services/claude-cli.ts](../src/services/claude-cli.ts) faz `spawn(CLAUDE_BIN, ["-p", prompt, "--output-format", "stream-json", "--verbose", ...])` e converte a saída linha-a-linha (JSON) em eventos SSE (`ClaudeStreamEvent`), consumidos pelo Chat via `fetch` + leitura manual do stream ([src/utils/sse-client.ts](../src/utils/sse-client.ts)). Não há chamada de rede para nenhuma API de modelo — o processo roda inteiramente local.

- **Continuidade de conversa**: a primeira mensagem de uma janela de Chat gera um `sessionId` (`--session-id`); mensagens seguintes reenviam esse id (`--resume`), preservando contexto entre mensagens em vez de cada uma ser um processo `claude` isolado e sem memória.
- **System prompt**: [src/config/agent-system-prompt.ts](../src/config/agent-system-prompt.ts) é injetado via `--append-system-prompt` em toda chamada — é a versão condensada de [MASTER_INSTRUCTIONS.md](MASTER_INSTRUCTIONS.md) (o documento completo não é reenviado a cada mensagem, por custo de tokens).
- **Caminho do binário**: `CLAUDE_CLI_PATH` no `.env.local` (ver README) — auto-detectável via `npm run setup:cli`.

## Git Manager

[src/lib/exec-git.ts](../src/lib/exec-git.ts) centraliza toda chamada ao Git: sempre `execFile("git", args)`, nunca `exec` com string de shell — elimina injeção via nome de branch, mensagem de commit, etc. [src/services/git/operations.ts](../src/services/git/operations.ts) expõe as operações individuais; [src/services/git/publish.ts](../src/services/git/publish.ts) orquestra o fluxo de "Publicar Projeto"; [src/services/git/resolve-project.ts](../src/services/git/resolve-project.ts) traduz falhas esperadas do git (`not a git repository`, etc.) em respostas HTTP limpas em vez de 500 cru.

## Decisões registradas

Ver [ADR/](ADR/).

## Sobre ARCHITECTURE_V2.md

O documento v2 descreve uma arquitetura de plataforma orientada a eventos (Core/Event Bus/Service Container/module registry, ~20 módulos incluindo Inventory/Excel/Catalog/Image/Brand/Deploy/Plugin managers). É a visão de longo prazo, registrada como referência — **ainda não implementada**. O Jarvis Hub de hoje é o dashboard descrito acima; a evolução pra plataforma modular é uma decisão de escopo em aberto, não algo silenciosamente em andamento.

# Arquitetura

## Objetivo

Dashboard local para operar a Claude Code CLI por linguagem natural, sem depender de nenhuma API paga. Todo processamento de IA acontece via processo local (`claude` CLI); o Next.js é só a casca de UI + orquestração.

## Multi-projeto, nunca acoplado a um projeto só

O Jarvis Hub nunca assume que existe "o projeto atual" fixo no filesystem dele mesmo. Todo estado de "quais projetos existem" e "o que cada um pode fazer" vive em dois lugares, propositalmente separados:

1. **Registry global** — `~/.jarvis/registry.json`, fora de qualquer repositório git. Lista os projetos conectados: `id`, `name`, `path`, `permissions`, `detection`. Gerenciado por [src/lib/registry.ts](../src/lib/registry.ts).
2. **Memória por projeto** — `<projeto>/.jarvis/memory/*.md`, dentro do próprio repositório do projeto conectado. Nunca copiada para dentro do Jarvis Hub, nunca compartilhada entre projetos. Gerenciada por [src/lib/memory.ts](../src/lib/memory.ts).

Essa separação existe para que: (a) o Jarvis não vaze caminhos/segredos locais do usuário para dentro de um repo versionado, e (b) cada projeto carregue sua própria memória para onde quer que vá, independente do Jarvis.

## Seleção de projeto e isolamento de sessão

O seletor de projeto (topo da UI, [src/components/layout/project-selector.tsx](../src/components/layout/project-selector.tsx)) escreve o `activeProjectId` em `useProjectStore` (Zustand). Trocar de projeto chama `useChatStore.reset()` — o histórico de chat do projeto anterior é descartado, nunca reaproveitado ou misturado com o próximo projeto.

## Permissões (10 toggles)

`readOnly`, `analyze`, `document`, `implement`, `refactor`, `test`, `build`, `git`, `push`, `deploy` — ver [src/types/permissions.ts](../src/types/permissions.ts). Default seguro: só `readOnly` + `analyze` ligados.

A única permissão que realmente muda o comportamento da CLI é a combinação `implement`/`refactor` (`hasWriteAccess`): sem ela, toda chamada ao chat força `--permission-mode plan` no servidor ([src/app/api/chat/route.ts](../src/app/api/chat/route.ts)) — a CLI planeja mas nunca executa. As demais permissões (`test`, `build`, `git`, `push`, `deploy`) gateiam rotas específicas de `/api/git/*`, não o modo da CLI.

## Integração com a Claude Code CLI

[src/lib/claude-cli.ts](../src/lib/claude-cli.ts) faz `spawn("claude", ["-p", prompt, "--output-format", "stream-json", ...])` e converte a saída linha-a-linha (JSON) em eventos SSE (`ClaudeStreamEvent`), consumidos pelo Chat via `fetch` + leitura manual do stream ([src/lib/sse-client.ts](../src/lib/sse-client.ts)). Não há chamada de rede para nenhuma API de modelo — o processo roda inteiramente local.

## Git Manager

[src/lib/git/client.ts](../src/lib/git/client.ts) centraliza toda chamada ao Git: sempre `execFile("git", args)`, nunca `exec` com string de shell — elimina injeção via nome de branch, mensagem de commit, etc. [src/lib/git/operations.ts](../src/lib/git/operations.ts) expõe as operações individuais (status, log, diff, branches, checkout, add, commit, push, pull, remote, stash); [src/lib/git/publish.ts](../src/lib/git/publish.ts) orquestra o fluxo de "Publicar Projeto" como um gerador assíncrono de passos, parando no primeiro passo que falhar.

## Decisões registradas

Ver [ADR/](ADR/).

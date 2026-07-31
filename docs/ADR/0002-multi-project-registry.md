# ADR 0002: Registry global fora do repo + memória isolada dentro de cada projeto

## Status

Aceito

## Contexto

O Jarvis Hub precisa operar sobre múltiplos projetos, potencialmente de clientes ou contextos diferentes. Guardar a lista de projetos conectados e o histórico/memória de cada um dentro do próprio repositório do Jarvis criaria dois problemas: (1) vazamento de caminhos locais e possivelmente segredos de um projeto para dentro de outro repositório versionado, e (2) acoplamento — mover ou clonar o Jarvis em outra máquina não deveria carregar (nem exigir) o estado de projetos de terceiros.

## Decisão

- O registry de projetos conectados (`id`, `name`, `path`, `permissions`, `detection`) vive em `~/.jarvis/registry.json`, fora de qualquer repositório git.
- A memória de cada projeto (`PROJECT_STATE`, `BACKLOG`, `ROADMAP`, `CHANGELOG`, `ADR`, `TECH_DEBT`) vive dentro do próprio projeto, em `<projeto>/.jarvis/memory/`. Não é copiada para o Jarvis nem compartilhada entre projetos conectados.
- Trocar de projeto ativo na UI descarta a sessão de chat do projeto anterior.

## Consequências

- O Jarvis Hub em si nunca versiona dados de outros projetos.
- A memória de um projeto viaja com o projeto (ex.: se o repo for clonado em outra máquina, a memória vai junto), não fica presa ao Jarvis Hub que a criou.
- Cada projeto precisa ser reconectado ao trocar de máquina/instalação do Jarvis, já que o registry é local à instalação do Hub, não ao projeto.

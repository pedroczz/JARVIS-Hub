# ADR 0001: Nenhuma API remota paga — invocar a Claude Code CLI como processo local

## Status

Aceito

## Contexto

O Jarvis Hub precisa de um "cérebro" que entenda linguagem natural e opere sobre projetos de código. As opções óbvias eram: (a) chamar a API da Anthropic diretamente, (b) usar OpenAI/LangChain/Pinecone para orquestração e busca semântica, ou (c) invocar a Claude Code CLI já instalada na máquina do usuário.

## Decisão

Nenhuma API paga é usada. O Jarvis invoca o binário `claude` (Claude Code CLI) como processo filho (`child_process.spawn`), com `--output-format stream-json`, e faz streaming da saída para a UI via SSE. Não existe agente próprio nem chamada de rede para nenhum provedor de modelo.

## Consequências

- Custo zero de API para o usuário além da assinatura que já paga pela CLI.
- Todo processamento acontece na máquina do usuário — sem dados de código saindo para um serviço de orquestração de terceiros.
- Funcionalidade do Jarvis fica limitada ao que a CLI expõe via linha de comando/`stream-json`; não há acesso a recursos que só existiriam numa integração de API direta (ex.: controle fino de parâmetros de modelo).
- `claude` precisa estar instalado e no `PATH` da máquina — é um requisito de ambiente, não uma dependência de pacote.

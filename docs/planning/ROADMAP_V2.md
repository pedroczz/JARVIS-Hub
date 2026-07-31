# =====================================================================
# JARVIS DEVELOPMENT HUB
# ROADMAP
# =====================================================================

Version: 2.0

Este documento define a ordem oficial de evolução do Jarvis.

Nenhuma funcionalidade poderá ser implementada fora desta sequência,
exceto mediante autorização explícita do usuário.

Cada fase possui objetivos, dependências e critérios de conclusão.

---

# FILOSOFIA

O Jarvis deverá evoluir como um produto comercial.

Cada módulo deverá estar funcional antes da implementação do próximo.

Nunca acumular funcionalidades incompletas.

Sempre finalizar uma etapa antes de iniciar outra.

---

# STATUS

Cada módulo poderá assumir apenas um estado.

PLANNED

IN PROGRESS

TESTING

VALIDATING

READY

DEPLOYED

DEPRECATED

Nunca considerar um módulo concluído sem passar por TESTING e VALIDATING.

---

# FASE 01 — CORE

Objetivo: criar o núcleo do sistema.

Inclui: Inicialização, Configuração, Registro de módulos, Eventos, Estado global.

Critério de conclusão: o sistema inicializa corretamente; todos os módulos conseguem registrar-se; nenhum módulo depende diretamente de outro.

---

# FASE 02 — PROJECT MANAGER

Objetivo: permitir múltiplos projetos.

Inclui: Cadastro, Seleção, Workspace, Configuração, Detecção automática.

Critério: o usuário pode alternar projetos sem reiniciar o Jarvis; cada projeto possui configuração independente.

---

# FASE 03 — WORKSPACE MANAGER

Objetivo: gerenciar arquivos.

Inclui: Criar, Mover, Renomear, Salvar, Excluir, Monitorar.

Critério: toda alteração realizada pela IA existe fisicamente no disco; nunca manter código apenas na conversa.

---

# FASE 04 — MEMORY MANAGER

Objetivo: memória permanente por projeto.

Guardar: Arquitetura, Tecnologias, Regras, Objetivos, Fluxos, Padrões.

Critério: o Jarvis lembra decisões sem o usuário repetir contexto.

---

# FASE 05 — AI ENGINE

Objetivo: centralizar inteligência.

Inclui: Planejamento, Análise, Explicações, Geração de código, Resumo. Nunca executar ações diretamente.

Critério: toda decisão passa pelo Workflow.

---

# FASE 06 — GIT MANAGER

Objetivo: controlar Git.

Inclui: Status, Commit, Push, Pull, Branches, Merge, Logs.

Critério: nenhum comando Git ocorre fora deste módulo.

---

# FASE 07 — WORKFLOW ENGINE

Objetivo: orquestrar todas as ações.

Fluxo: Usuário → Planejamento → Validação → Execução → Resumo.

Critério: toda ação segue o Workflow.

---

# FASE 08 — DASHBOARD

Objetivo: interface principal.

Inclui: Projetos, Chat, Git, Logs, Memória, Estoque, Deploy. Dashboard nunca contém lógica.

---

# FASE 09 — CHAT

Objetivo: conversação.

Inclui: Histórico, Contexto, Atalhos, Comandos, Respostas.

Critério: o Chat controla o Workflow; nunca executa ações diretamente.

---

# FASE 10 — SAFE MODE

Objetivo: evitar alterações acidentais.

Antes de executar: mostrar Arquivos, Diff, Impacto, Resumo. Perguntar confirmação.

Critério: nenhuma alteração importante ocorre sem aprovação.

---

# FASE 11 — DOCUMENTATION

Objetivo: gerar documentação automaticamente.

Atualizar: README, CHANGELOG, Arquitetura, Roadmap.

Critério: toda implementação atualiza documentação.

---

# FASE 12 — INVENTORY MANAGER

Objetivo: gerenciar produtos.

Inclui: Categorias, Estoque, Coleções, Serial, Preço, Fornecedor.

Critério: toda informação de produto pertence exclusivamente ao Inventory.

---

# FASE 13 — EXCEL CONNECTOR

Objetivo: transformar Excel na fonte oficial dos produtos.

Funções: Importar, Exportar, Validar, Sincronizar.

Critério: toda alteração na planilha pode atualizar o catálogo.

---

# FASE 14 — CATALOG MANAGER

Objetivo: gerar catálogo automaticamente.

Entrada: Excel → Objetos internos → JSON → Site.

Critério: nenhum produto é editado manualmente.

---

# FASE 15 — IMAGE MANAGER

Objetivo: automatizar imagens.

Funções: Converter, Renomear, Compressão, WebP, Thumbnail.

Critério: toda imagem nova é processada automaticamente.

---

# FASE 16 — BRAND MANAGER

Objetivo: centralizar identidade visual.

Guardar: Nome, Logo, SEO, Cores, Tipografia, Contato, WhatsApp.

Critério: alterar a marca atualiza todos os projetos relacionados.

---

# FASE 17 — DEPLOY MANAGER

Objetivo: automatizar publicação.

Fluxo: Build → Lint → Testes → Resumo → Commit → Push → Deploy.

Critério: nenhum deploy ocorre com falhas.

---

# FASE 18 — PLUGIN SYSTEM

Objetivo: permitir expansão.

Cada plugin poderá adicionar: Comandos, Integrações, Eventos, Painéis. Nunca modificar o Core.

---

# FASE 19 — AUTOMATION ENGINE

Objetivo: criar automações.

Exemplo: atualizar catálogo diariamente, backup, validação, sincronização.

Critério: automações independem do Chat.

---

# FASE 20 — KNOWLEDGE BASE

Objetivo: transformar o Jarvis em especialista em cada projeto.

Guardar: Decisões, Problemas, Correções, Boas práticas, Histórico.

Critério: cada projeto possui sua própria base de conhecimento.

---

# DEFINIÇÃO DE CONCLUÍDO

Uma funcionalidade somente poderá ser marcada READY quando:

Código implementado. Arquivos persistidos. Build aprovado. Lint aprovado. Testes aprovados. Documentação atualizada. Git limpo. Sem erros conhecidos.

---

# DEFINIÇÃO DE PRONTO PARA PRODUÇÃO

Um módulo somente poderá ser DEPLOYED quando:

READY. Validado. Sem TODOs críticos. Sem BUGs conhecidos. Cobertura mínima aceitável. Documentação completa.

---

# PRIORIDADE

Sempre implementar: Infraestrutura → Serviços → Workflow → Interface.

Nunca iniciar pela interface.

---

# REGRA FINAL

A evolução do Jarvis deverá seguir este Roadmap.

Novas funcionalidades deverão ser inseridas na fase correta.

Nunca criar módulos paralelos que dupliquem responsabilidades existentes.

Toda evolução deverá fortalecer a arquitetura existente.

---

## Status real em 2026-07-31 (nota do Jarvis Hub, não do documento original)

Fases 01–11 descrevem, com nomes diferentes, capacidades que o dashboard atual (v1, ver [../ARCHITECTURE.md](../ARCHITECTURE.md)) já cobre de forma mais simples: Project Manager ≈ `services/registry.ts` + tela Projetos; Memory Manager ≈ `services/memory.ts` + `.jarvis/memory/`; Git Manager ≈ `services/git/*`; Workspace Manager ≈ o próprio `fs` que a CLI já usa via suas tools (Read/Write/Edit); Documentation ≈ convenção de atualizar `.jarvis/memory/CHANGELOG.md` manualmente. Fase 10 (Safe Mode) é a única lacuna real documentada em `TECH_DEBT.md`/`BACKLOG.md`.

Fases 12–20 (Inventory, Excel Connector, Catalog, Image, Brand, Deploy Manager como automação, Plugin System, Automation Engine, Knowledge Base) não existem hoje em nenhuma forma — são construção nova.

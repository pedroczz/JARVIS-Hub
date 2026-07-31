# Planning v2 — visão de plataforma (não implementada)

Documentos fornecidos pelo usuário descrevendo uma evolução do Jarvis Hub de "dashboard local" (o que existe hoje — ver [../ARCHITECTURE.md](../ARCHITECTURE.md)) para uma plataforma modular orientada a eventos com ~20 módulos independentes.

**Nada neste diretório está implementado.** É referência de design para decisões futuras.

- [ARCHITECTURE_V2.md](ARCHITECTURE_V2.md) — camadas (Presentation/Application/Domain/Infrastructure), Event Bus, Service Container, lista de módulos.
- [ROADMAP_V2.md](ROADMAP_V2.md) — 20 fases de evolução, na ordem em que deveriam ser construídas.
- [modules/](modules/) — specs detalhadas recebidas até agora:
  - [01-core.md](modules/01-core.md) — kernel: bootstrap, registry, event bus, lifecycle, service container, health check
  - [02-project-manager.md](modules/02-project-manager.md)
  - [03-memory-manager.md](modules/03-memory-manager.md)
  - [04-git-manager.md](modules/04-git-manager.md)
  - [05-ai-engine.md](modules/05-ai-engine.md)
  - [06-inventory-manager.md](modules/06-inventory-manager.md)
  - [07-excel-connector.md](modules/07-excel-connector.md)
  - [08-workflow-engine.md](modules/08-workflow-engine.md)
  - [10-catalog-manager.md](modules/10-catalog-manager.md) *(módulo 09 ainda não recebido)*

Módulos do Roadmap ainda sem spec detalhado: Workspace Manager, Dashboard, Chat, Safe Mode, Documentation, Image Manager, Brand Manager, Deploy Manager, Plugin System, Automation Engine, Knowledge Base.

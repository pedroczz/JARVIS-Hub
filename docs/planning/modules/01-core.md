# MODULE 01 — CORE

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Dependencies: None

---

# OBJETIVO

O Core é o coração do Jarvis. Ele é responsável por inicializar a aplicação, registrar módulos, controlar o ciclo de vida, disparar eventos, gerenciar estado global e disponibilizar serviços compartilhados. Nenhum módulo poderá existir sem estar registrado no Core.

---

# RESPONSABILIDADE

O Core NÃO possui lógica de negócio. O Core apenas organiza o sistema. Tudo relacionado a Git, Projetos, Deploy, Excel, Dashboard, IA pertence aos módulos específicos.

Responsabilidades: Inicialização, Registro de módulos, Gerenciamento de estado, Eventos, Configuração, Serviços compartilhados, Health Check, Shutdown, Logs globais, Lifecycle.

---

# ESTRUTURA

```
core/
  application.ts
  bootstrap.ts
  registry.ts
  event-bus.ts
  lifecycle.ts
  logger.ts
  health.ts
  state.ts
  configuration.ts
  service-container.ts
```

---

# BOOTSTRAP

Fluxo: Iniciar aplicação → Carregar Configuração → Registrar Serviços → Registrar Eventos → Registrar Módulos → Executar Health Check → Aplicação pronta.

---

# REGISTRY

Todo módulo deverá registrar: Nome, Versão, Dependências, Descrição, Status, Eventos publicados, Eventos consumidos, Permissões.

Exemplo: Project Manager, Git Manager, Inventory Manager, Dashboard, Chat, Deploy, Memory, Workflow, AI Engine.

---

# LIFECYCLE

Estados possíveis: BOOTING, READY, BUSY, IDLE, ERROR, STOPPING, STOPPED.

Nenhum módulo poderá executar antes do estado READY.

---

# HEALTH CHECK

Executado automaticamente. Validar: Workspace, Git, Node, Dependências, Permissões, Arquivos obrigatórios, Memória, Plugins.

Caso algum item falhe: Registrar erro, Informar Dashboard, Bloquear módulos dependentes.

---

# EVENT BUS

Toda comunicação deverá ocorrer por eventos. Nunca chamar módulos diretamente.

Exemplo: InventoryUpdated → CatalogUpdated → BuildRequested → DeployRequested → DeploymentFinished.

Cada evento deverá possuir: id, timestamp, origin, payload, priority, status.

---

# PRIORIDADES

LOW, NORMAL, HIGH, CRITICAL. Eventos críticos nunca poderão ser descartados.

---

# STATE MANAGER

Responsável por armazenar: Projeto ativo, Usuário, Workspace, Modo, Deploy atual, Build atual, Modelo IA, Sessão.

Nunca armazenar produtos. Nunca armazenar Git. Nunca armazenar memória permanente.

---

# SERVICE CONTAINER

Todos os Services deverão ser registrados. Exemplo: GitService, DeployService, ExcelService, ImageService, CatalogService, WorkflowService, MemoryService, LoggerService.

Nunca instanciar Services diretamente. Sempre resolver pelo Container.

---

# LOGGER

Tipos: INFO, WARNING, ERROR, SUCCESS, DEBUG, AUDIT. Todos os módulos deverão utilizar Logger. Nunca utilizar console.log diretamente.

---

# CONFIGURATION

Arquivo: `jarvis.config.json`. Exemplo de seções: Application, Theme, Language, AI, Workspace, Git, Dashboard, Plugins, Logs. Nunca utilizar constantes espalhadas.

---

# WORKSPACE

O Core deverá conhecer: Workspace atual, Projetos cadastrados, Projeto ativo. Nunca modificar arquivos — isso pertence ao Workspace Manager.

---

# SHUTDOWN

Antes de encerrar: Salvar estado, Finalizar tarefas, Fechar Workers, Salvar Logs, Liberar recursos. Nunca interromper tarefas críticas.

---

# FAIL SAFE

Se um módulo falhar: Isolar módulo, Registrar erro, Continuar execução sempre que possível. Nunca derrubar toda aplicação.

---

# MODULE INTERFACE

Todo módulo deverá implementar: `initialize()`, `start()`, `stop()`, `health()`, `dispose()`, `status()`, `version()`, `description()`. Nenhum módulo poderá possuir comportamento diferente.

---

# PERMISSÕES

Cada módulo deverá declarar: Leitura, Escrita, Rede, Git, Sistema, Arquivos, Execução. O Core validará essas permissões.

---

# HEALTH API

Todo módulo deverá responder: Está ativo? Está saudável? Último erro. Última execução. Versão. Tempo de atividade.

---

# DEPENDÊNCIAS

O Core impede dependências circulares. Se detectar: a inicialização deverá falhar.

---

# OBSERVABILIDADE

Todo evento deverá gerar: Log, Timestamp, Origem, Destino, Resultado, Duração. Permite auditoria completa.

---

# ESCALABILIDADE

O Core deverá suportar: Múltiplos projetos, Múltiplos Workspaces, Múltiplos modelos de IA, Plugins, Execuções paralelas — sem alterações estruturais.

---

# CRITÉRIO DE CONCLUSÃO

✔ Inicializar o sistema · ✔ Registrar módulos · ✔ Registrar serviços · ✔ Registrar eventos · ✔ Gerenciar estado · ✔ Executar Health Check · ✔ Disponibilizar Logger · ✔ Disponibilizar Container · ✔ Disponibilizar Event Bus · ✔ Encerrar corretamente.

---

# FUTURAS EXTENSÕES

Task Scheduler, Workers, Queue Manager, IPC, Telemetry, Crash Reporter, Auto Recovery — sem alterar a arquitetura existente.

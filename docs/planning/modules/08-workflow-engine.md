# MODULE 08 — WORKFLOW ENGINE

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, PROJECT_MANAGER, MEMORY_MANAGER, AI_ENGINE, GIT_MANAGER

---

# MISSÃO

Orquestrador central do Jarvis. Toda ação passa obrigatoriamente pelo Workflow — nenhum módulo executa operações críticas diretamente.

# FILOSOFIA

Pensar → Planejar → Validar → Executar → Revisar → Registrar → Concluir. Nunca executar ações fora desse fluxo.

# RESPONSABILIDADES / NUNCA

Orquestrar tarefas, executar etapas, controlar dependências, validar pré-requisitos, registrar histórico, controlar rollback, notificar Dashboard. Nunca modifica código, executa Git, edita arquivos, consulta banco ou gera inventário diretamente — isso pertence aos módulos respectivos.

# ESTRUTURA

```
workflow/
  workflow-engine.ts
  workflow-runner.ts
  workflow-validator.ts
  workflow-registry.ts
  workflow-history.ts
  workflow-queue.ts
  workflow-rollback.ts
  workflow-summary.ts
```

# WORKFLOW / TASK

Workflow: id, nome, descrição, tipo, projeto, status, autor, prioridade, etapas, resultado, createdAt, updatedAt. Status: CREATED, WAITING, RUNNING, PAUSED, FAILED, ROLLBACK, FINISHED, CANCELLED. Prioridade: LOW, NORMAL, HIGH, CRITICAL.

Cada Workflow é composto por Tasks (id, nome, tipo, status, dependências, resultado, tempo, erro) — uma Task só inicia quando todas as dependências estão concluídas. Tasks independentes rodam em paralelo quando possível.

# EXECUÇÃO

Antes de iniciar, validar em ordem: Projeto → Workspace → Memória → Permissões → Dependências → Saúde → Executar.

# ROLLBACK / CHECKPOINTS

Se uma Task crítica falhar: rollback das Tasks concluídas, tudo registrado. Checkpoints (pontos de recuperação) antes de Deploy, Git Push, migrações, atualização de inventário.

# VALIDAÇÃO / APROVAÇÃO / EXECUÇÃO ASSISTIDA

Antes de executar, verificar arquivos/projeto/permissões/dependências/estado — nunca iniciar workflow inválido. Workflows críticos (commit, push, deploy, delete, reset, migração) exigem confirmação: mostrar plano, arquivos afetados, impacto, tempo estimado, risco, resultado esperado, perguntar "Deseja continuar?".

# REGRAS / HISTÓRICO / TEMPLATES

Nenhuma etapa pode ser ignorada; nunca executar parcialmente sem registrar. Histórico guarda quem/quando/projeto/resultado/tempo/etapas/falhas/rollback. Templates reutilizáveis: Publicar Projeto, Atualizar Catálogo, Importar Excel, Novo Produto, Novo Deploy, Novo Release.

Exemplo de workflow "Atualizar Catálogo": Importar Excel → Validar → Atualizar Inventory → Gerar JSON → Testes → Commit → Push → Deploy → Registrar → Finalizar.

# CANCELAMENTO / FILA

Cancelamento permitido, mas nunca interrompe etapa crítica (aguarda ponto seguro). Fila com estados Waiting/Running/Paused/Finished.

# EVENTOS PUBLICADOS

WorkflowCreated, WorkflowStarted, WorkflowPaused, WorkflowResumed, WorkflowFailed, WorkflowFinished, WorkflowCancelled, RollbackStarted, RollbackFinished.

# EVENTOS CONSUMIDOS

PlanningFinished, PublishRequested, DeployRequested, InventoryUpdated, ExcelImported.

# API PÚBLICA

`create() run() pause() resume() cancel() rollback() history() status() queue() summary()`

# DASHBOARD

Workflow atual, fila, tempo estimado, progresso, próxima etapa, histórico.

# SEGURANÇA / PERFORMANCE

Nunca executa workflows desconhecidos ou Tasks fora da sequência. Executa só módulos necessários (sem carregamento completo da app), cache inteligente.

# FUTURO

Workers, fila distribuída, execução remota, agendamento, automações.

# CRITÉRIO DE CONCLUSÃO

✔ Orquestração · ✔ Dependências · ✔ Paralelismo · ✔ Rollback · ✔ Histórico · ✔ Templates · ✔ Dashboard · ✔ Eventos · ✔ Integração com todos os módulos.

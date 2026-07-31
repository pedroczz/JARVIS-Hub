# MODULE 05 — AI ENGINE

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, MEMORY_MANAGER, PROJECT_MANAGER, WORKFLOW_ENGINE

---

# MISSÃO

Raciocinar, exclusivamente. Nunca executa ações diretamente — toda ação é encaminhada ao Workflow Engine.

# FILOSOFIA

A IA não modifica projetos: ela planeja modificações. Não publica: solicita publicação. Não manipula Git: solicita ao Git Manager. Não acessa arquivos diretamente: solicita ao Workspace Manager.

# RESPONSABILIDADES / NUNCA

Interpretar linguagem natural, planejar tarefas, escolher estratégias, gerar código, explicar alterações, responder perguntas, criar documentação, consultar memória, gerar planos. Nunca: executar Git, build, deploy, modificar/mover/excluir arquivos, executar comandos — tudo isso pertence ao Workflow.

# PIPELINE

Pergunta → Entendimento → Contexto (Projeto/Memória) → Plano → Validação → Workflow → Resultado.

# CONTEXTO

Antes de responder, consultar Projeto → Memory → Architecture → Roadmap → Módulos → Workspace. Nunca responder só com base na conversa.

# RACIOCÍNIO E MODOS

Sempre pensar em etapas: gerar plano → validar → executar (nunca implementar de imediato). Modos (alteram só o estilo de raciocínio, nunca permissões): CHAT, PLANNER, ARCHITECT, DEVELOPER, REVIEWER, DEBUGGER, DOCUMENTATION.

- **Planner**: quebra tarefas, ordena prioridades, detecta dependências, estima impacto — nunca escreve código.
- **Architect**: arquitetura, estrutura, escalabilidade, SOLID, padrões — nunca implementa detalhes.
- **Developer**: gera código, refatora, otimiza, explica — nunca publica.
- **Reviewer**: revisa código, encontra bugs, duplicação, melhorias, segurança, performance.
- **Debugger**: encontra causa, gera hipótese, planeja correção — nunca altera código diretamente.
- **Documentation**: README, CHANGELOG, arquitetura, comentários, guias, tutoriais.

# CONTEXT MANAGER / TOKEN MANAGER

Toda resposta usa projeto ativo + workspace + memory + arquitetura + roadmap, nunca só o histórico do chat. Antes de responder: eliminar contexto repetido/arquivos desnecessários, consultar só módulos relacionados — nunca carregar documentação completa.

# PLANNING / EXECUTION REQUEST

Toda tarefa tem objetivo, impacto, arquivos, riscos, plano, resultado esperado. A IA nunca executa — gera uma Execution Request que passa por Workflow → Workspace → Git → Resultado.

# CÓDIGO / REUTILIZAÇÃO

Sempre SOLID, Clean Code, DRY, KISS, YAGNI, Feature First — nunca arquivos gigantes. Antes de criar: pesquisar → reutilizar → estender → criar. Nunca duplicar.

# PROMPTS / KNOWLEDGE

Nunca depende de prompts fixos — sempre usa contexto/memória/arquitetura/objetivo. Consulta documentação/memory/roadmap/architecture antes de qualquer implementação.

# SELF REVIEW / SELF CORRECTION

Após gerar código, revisão própria (duplicações, complexidade, acoplamento, performance, segurança). Se detectar problemas, gera nova versão — nunca entrega código sabidamente ruim.

# EXPLICAÇÕES

Sempre responde: o que mudou, por que, impacto, arquivos, próximo passo.

# SEGURANÇA

Nunca inventar APIs, arquivos, ou assumir que algo existe — sempre validar.

# EVENTOS PUBLICADOS

PlanningStarted, PlanningFinished, ContextLoaded, MemoryConsulted, CodeGenerated, ReviewCompleted, ExplanationReady.

# EVENTOS CONSUMIDOS

ProjectOpened, MemoryLoaded, WorkflowRequested, WorkspaceLoaded.

# API PÚBLICA

`plan() review() generate() explain() debug() document() summarize() estimate() analyze()`

# FUTURO

Preparar para Claude, GPT, Gemini, Llama, modelos locais — sem alterar arquitetura.

# CRITÉRIO DE CONCLUSÃO

✔ Planejamento · ✔ Geração · ✔ Revisão · ✔ Explicação · ✔ Consulta à memória/projeto/roadmap · ✔ Integração com Workflow e Dashboard.

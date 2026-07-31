# MODULE 03 — MEMORY MANAGER

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, PROJECT_MANAGER

---

# MISSÃO

Armazenar, organizar, consultar e atualizar todo o conhecimento permanente do Jarvis. A memória pertence ao projeto, nunca à conversa.

# FILOSOFIA

O chat é temporário; a memória é permanente. O usuário nunca deve repetir informação importante. Toda decisão arquitetural aprovada é registrada.

# RESPONSABILIDADES

Gerenciar memória, persistir conhecimento, recuperar contexto, versionar decisões, registrar padrões/objetivos/regras. Nunca executar lógica de negócio.

# ESTRUTURA

```
memory/
  memory-service.ts
  memory-index.ts
  memory-search.ts
  memory-writer.ts
  memory-validator.ts
  summarizer.ts
  embeddings.ts
```

# LOCALIZAÇÃO

```
<projeto>/.jarvis/memory/
  architecture.md
  decisions.md
  business.md
  workflows.md
  coding.md
  integrations.md
  glossary.md
  changelog.md
  knowledge.json
```

Nunca misturar memórias entre projetos.

# CATEGORIAS

Architecture, Business, Development, Deploy, Git, Integrations, Inventory, Catalog, Brand, Workflow, Errors, Solutions, Rules. Todo registro pertence a exatamente uma categoria.

# MEMORY ENTRY

id, title, category, summary, content, createdAt, updatedAt, author, version, importance, tags, status, source.

# IMPORTÂNCIA / STATUS

Importância: LOW, NORMAL, HIGH, CRITICAL (críticas nunca removidas automaticamente). Status: ACTIVE, ARCHIVED, SUPERSEDED, DEPRECATED.

# O QUE DEVE SER MEMORIZADO

Objetivos, arquitetura, framework, banco, deploy, estrutura, fluxos, decisões, padrões, convenções, clientes, integrações, problemas recorrentes, soluções, boas práticas.

# O QUE NÃO DEVE SER MEMORIZADO

Mensagens casuais, conversas temporárias, explicações, logs, execuções, perguntas isoladas, dados sensíveis.

# APRENDIZADO

Gatilhos ("Lembre", "Registre", "Este será o padrão", "Daqui pra frente", "Sempre") fazem o Jarvis **sugerir** registrar — nunca registrar automaticamente.

# RECUPERAÇÃO

Antes de implementar qualquer funcionalidade, consultar em ordem: Architecture → Business → Rules → Workflow → Coding → Integrations. Nunca gerar código sem consultar a memória.

# SEARCH / RESUMO / VERSIONAMENTO / CONFLITOS

Busca por categoria/tag/título/conteúdo/importância/data/projeto. Resumos nunca apagam o conteúdo original. Toda alteração gera nova versão, histórico sempre disponível. Regras conflitantes: mostrar ambas, pedir decisão do usuário — nunca decidir sozinho.

# DNA DO PROJETO / PERFIL

DNA: framework, arquitetura, padrões, estrutura, bibliotecas, deploy, banco, workflow, git, testes, design, identidade — nunca depender só da conversa.

Perfil exemplo: Ana Wolf Semijoias e Pratas · Vercel · Next.js · produtos via Excel · catálogo JSON · workflow Push → Deploy · Git GitHub · inventário Excel.

# DECISÕES / REGRAS / WORKFLOWS / ERROS / SOLUÇÕES / GLOSSÁRIO

Decisões registram data/motivo/impacto (ex.: "fonte oficial dos produtos passa a ser Excel"). Regras permanentes (ex.: "nunca editar products.json manualmente"). Workflows nomeados (atualizar catálogo, novo deploy, nova marca...). Erros: erro/causa/correção/data/projeto — nunca repetir o mesmo erro. Soluções aprovadas sempre reutilizadas antes de criar novas. Glossário de termos do domínio (serial, coleção, categoria, produto, fornecedor, cliente).

# EVENTOS PUBLICADOS

MemoryCreated, MemoryUpdated, MemoryDeleted, MemoryLoaded, MemoryIndexed, KnowledgeUpdated, ProjectDNAUpdated.

# EVENTOS CONSUMIDOS

ProjectOpened, ProjectClosed, ArchitectureChanged, WorkflowChanged, RuleChanged.

# API PÚBLICA

`create() update() delete() archive() restore() search() list() summary() validate() load() save() version()`

# SEGURANÇA

Nunca registrar senhas, tokens, chaves, dados bancários, dados pessoais sensíveis.

# PERFORMANCE

Carregar só memória relevante, nunca a base toda sem necessidade — indexação + cache inteligente.

# FUTURO

Embeddings, busca semântica, vetorização, RAG local, LLM independente — sem alterar a arquitetura.

# CRITÉRIO DE CONCLUSÃO

✔ Memória persistente por projeto · ✔ Busca rápida · ✔ Versionamento · ✔ Indexação · ✔ Project DNA · ✔ Histórico · ✔ Resumos · ✔ Integração com Dashboard, AI Engine e Workflow.

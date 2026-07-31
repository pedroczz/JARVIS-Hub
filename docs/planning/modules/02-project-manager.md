# MODULE 02 — PROJECT MANAGER

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE

---

# MISSÃO

Descobrir, registrar, abrir, configurar e administrar todos os projetos conhecidos pelo Jarvis. O usuário nunca deverá precisar informar caminhos de pastas durante o uso normal.

---

# RESPONSABILIDADE

Gerenciar projetos, workspaces, seleção de projeto ativo, metadata, detecção de tecnologias, configurações. Nunca editar código, executar Git ou Deploy.

---

# ESTRUTURA

```
projects/
  registry.ts
  detector.ts
  loader.ts
  scanner.ts
  validator.ts
  project-config.ts
  project-service.ts
  workspace.ts
```

---

# PROJECT REGISTRY

Registro permanente. Cada projeto possui um ID único (nunca depender só do caminho da pasta). Exemplo: Ana Wolf, Jarvis Hub, Site Institucional, CRM, ERP.

---

# PROJECT METADATA

id, name, description, workspace, framework, language, packageManager, repository, defaultBranch, deployProvider, database, lastOpened, lastBuild, lastDeploy, status, owner, createdAt, updatedAt, tags.

---

# PROJECT.JSON

Cada projeto possui `project.json`, ex.:

```json
{
  "name": "Ana Wolf Semijoias e Pratas",
  "framework": "Next.js",
  "deploy": "Vercel",
  "repository": "pedroczz/anawolfsemijoias",
  "database": "Excel",
  "catalog": "JSON",
  "workspace": "C:/Users/Pedro/anawolfsemijoias"
}
```

Nunca depender apenas do `package.json`.

---

# DETECÇÃO AUTOMÁTICA

Ao abrir um Workspace: detectar Framework, Linguagem, Package Manager, Git, Deploy, Banco, Node, Build, Testes. Nunca perguntar informações que possam ser descobertas automaticamente.

---

# WORKSPACE SCANNER

Localizar `.git`, `package.json`, lockfiles (pnpm/npm/yarn), `tsconfig`, `next.config`, `vite.config`, `docker-compose`, `README`, `project.json`.

---

# FRAMEWORK DETECTOR

Next.js, React, Vue, Angular, Node, Express, NestJS, Python, Flask, Django, Laravel, ASP.NET, Java, Spring — sem configuração manual.

---

# PACKAGE MANAGER / DEPLOY / REPOSITORY DETECTORS

Package manager: npm/pnpm/yarn/bun, sempre usar o já existente, nunca alterar automaticamente. Deploy: Vercel/Netlify/Cloudflare/Railway/Docker/AWS/Azure/GitHub Pages — se desconhecido, registrar, nunca assumir. Repository: GitHub/GitLab/Bitbucket/Azure DevOps/Local — extrair owner, repo, default branch, remote.

---

# PROJECT STATE

READY, BUILDING, TESTING, DEPLOYING, ERROR, OFFLINE, ARCHIVED.

---

# OPEN / SWITCH

Abrir: seleciona projeto → abre workspace → executa scanner → detecta tecnologias → atualiza metadata → registra memória → projeto ativo. Trocar: salva estado atual, fecha recursos, limpa cache temporário, carrega memória, atualiza contexto — nunca misturar estados.

---

# BUSCA / TAGS / FAVORITOS / RECENTES

Buscar por nome, tag, framework, tecnologia, linguagem, deploy, descrição, status. Tags livres (cliente, produção, teste, pessoal, estudo, website, api, mobile, desktop). Favoritos sempre no topo. Recentes: últimos usados, última data, último comando, último deploy.

---

# HEALTH CHECK

Validar Workspace, Git, Dependências, Build, Configuração, Arquivos obrigatórios.

---

# AUTOCOMPLETE

Ex.: "Atualize o catálogo" → localizar projeto relacionado → se só um, seleciona automaticamente; se vários, pede confirmação.

---

# PROJECT INTELLIGENCE / DNA / PROFILE

Cada projeto tem conhecimento próprio (objetivos, arquitetura, tecnologias, fluxos, convenções, dependências, boas práticas) — nunca compartilhado entre projetos. DNA: framework, arquitetura, padrões, estrutura, bibliotecas, deploy, banco, workflow, git, testes, design, identidade.

Perfil exemplo: Ana Wolf Semijoias e Pratas · Next.js 15 · Vercel · Produtos via Excel · Catálogo JSON · Sem banco · GitHub · branch main · workflow Git Push → Vercel · contato WhatsApp · domínio Vercel.

---

# MULTI PROJECT

Manter diversos projetos simultaneamente. Nunca descarregar permanentemente — apenas suspender.

---

# EVENTOS PUBLICADOS

ProjectCreated, ProjectOpened, ProjectClosed, ProjectChanged, WorkspaceLoaded, WorkspaceValidated, ProjectArchived, MetadataUpdated.

# EVENTOS CONSUMIDOS

ApplicationStarted, WorkspaceRequested, GitRepositoryDetected, MemoryLoaded, BuildFinished, DeployFinished.

---

# API PÚBLICA

`create() open() close() remove() archive() favorite() list() search() scan() refresh() validate() status() current() switch()`

---

# SEGURANÇA

Nunca abrir projetos fora da lista de permissões sem confirmação. Nunca modificar arquivos automaticamente durante detecção.

---

# CRITÉRIO DE CONCLUSÃO

✔ Detectar automaticamente qualquer projeto suportado · ✔ Identificar framework/Git/Deploy · ✔ Gerenciar múltiplos projetos · ✔ Alternar contexto corretamente · ✔ Persistir metadata · ✔ Integrar-se ao Memory Manager e ao Dashboard · ✔ Publicar eventos corretamente.

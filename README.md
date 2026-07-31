# Jarvis Development Hub

Dashboard local (Next.js) para operar a [Claude Code](https://claude.com/product/claude-code) CLI por linguagem natural, sem depender de nenhuma API paga (nem OpenAI, nem Anthropic API, nem LangChain/Pinecone). Roda 100% na máquina do usuário — conversa com a Claude Code CLI já instalada, como processo local (`child_process`), nunca via API remota.

## Pré-requisitos

- Node.js 20+
- [Claude Code CLI](https://claude.com/product/claude-code) instalada e disponível no `PATH` como `claude`
- Git

### Se você só tem a extensão do VS Code (sem CLI standalone no PATH)

A extensão `anthropic.claude-code` do VS Code embute o binário nativo em
`resources/native-binary/claude.exe` dentro da própria pasta da extensão
(ex.: `%USERPROFILE%\.vscode\extensions\anthropic.claude-code-<versão>-win32-x64\`).
Crie um `.env.local` na raiz do projeto apontando para ele. Use barras
normais e **sem aspas duplas** — o parser de `.env` do Next.js interpreta
`\r`/`\n` dentro de aspas duplas como caracteres de controle, o que corrompe
caminhos Windows com pastas como `resources` ou `native-binary`:

```
CLAUDE_CLI_PATH=C:/Users/<voce>/.vscode/extensions/anthropic.claude-code-<versão>-win32-x64/resources/native-binary/claude.exe
```

Esse caminho muda a cada atualização da extensão (a versão vai no nome da
pasta) — se o Chat começar a falhar com "ENOENT" depois de uma atualização,
é só ajustar o `.env.local`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · componentes estilo shadcn/ui escritos à mão (Radix UI + CVA — a CLI `shadcn` está bloqueada pela política de rede do ambiente) · Framer Motion · Zustand · React Hook Form · Zod · TanStack React Query · Lucide React.

## Arquitetura — multi-projeto, nunca acoplado a um projeto só

- **Registry de projetos conectados**: `~/.jarvis/registry.json` (fora de qualquer repo) — caminho, nome e permissões de cada projeto.
- **Memória isolada por projeto**: `<projeto>/.jarvis/memory/` (`PROJECT_STATE`, `BACKLOG`, `ROADMAP`, `CHANGELOG`, `ADR`, `TECH_DEBT`) — dentro do próprio projeto, nunca copiada para o Jarvis, nunca compartilhada entre projetos.
- **Seletor de projeto** no topo da interface; trocar de projeto descarta o chat/sessão do anterior.
- **Permissões por projeto** (10 toggles): `readOnly`, `analyze`, `document`, `implement`, `refactor`, `test`, `build`, `git`, `push`, `deploy`. Default seguro: só leitura + análise.

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para detalhes.

## Componentes/páginas

Sidebar com 16 módulos. Funcionais: **Home**, **Projetos** (conectar/desconectar, detecção automática de framework/git/deps), **Chat**, **Git**. Stub "em breve": Arquitetura, Componentes, Backlog, Roadmap, Memória, Doctor, CTO, Documentação, Deploy, Configurações, Logs, Timeline.

## "Agente"/integração com IA

Não há agente próprio — o Jarvis invoca a Claude Code CLI (`claude -p "<prompt>" --output-format stream-json`) via `child_process.spawn`, streamando a resposta para o Chat via Server-Sent Events. Se o projeto ativo não tem permissão de escrita (`implement`/`refactor`), o backend força `--permission-mode plan` (a CLI só planeja, nunca executa) — gate real no servidor, em [src/app/api/chat/route.ts](src/app/api/chat/route.ts).

## Git Manager

Módulo [src/lib/git/](src/lib/git/) — todas as operações usam o Git CLI local (`execFile`, args em array, nunca shell), nunca integração de IDE/API remota (funciona igual com GitHub/GitLab/Bitbucket/etc). 12 rotas `/api/git/*`. Botão **Publicar Projeto**: build → lint → test → auditoria (stub) → resumo do que seria commitado → confirmação → só então `git add`/`commit`/`push`. Nunca `reset --hard`, nunca push se os testes falharem.

## Limitações conhecidas

- Aprovação clique-a-clique antes de mudanças (Safe Mode completo) ainda não existe — só o gate binário de permissão.
- UI de merge/rebase/stash/tag/reset-soft ainda não tem botão (API existe e foi testada).
- `npm audit`: CVEs "high" vendored dentro do próprio `next`, sem fix não-breaking disponível — acompanhar em [.jarvis/memory/TECH_DEBT.md](.jarvis/memory/TECH_DEBT.md).

## Memória do próprio Jarvis Hub

Como qualquer projeto conectado, o Jarvis Hub mantém sua própria memória em [.jarvis/memory/](.jarvis/memory/) (`PROJECT_STATE`, `BACKLOG`, `ROADMAP`, `CHANGELOG`, `ADR`, `TECH_DEBT`).

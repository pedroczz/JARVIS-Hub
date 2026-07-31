# TECH_DEBT — Jarvis Development Hub

_Débito técnico conhecido e seu impacto._

- **`npm audit`**: possíveis CVEs "high" vendored dentro do próprio `next`, sem fix não-breaking disponível no momento do scaffold. Impacto: nenhum vetor de exploração direto identificado (app roda local, sem exposição pública), mas deve ser revisado a cada bump de versão do Next.
- **Sem persistência de chat entre reloads**: a CLI já mantém contexto real entre mensagens (`--session-id`/`--resume`), mas o `sessionId` só vive em memória do cliente (Zustand, sem `persist`) — recarregar a página perde a referência e a próxima mensagem começa uma sessão nova, mesmo a antiga ainda existindo no disco da CLI. Trocar de projeto também descarta de propósito (isolamento).
- **Auditoria do fluxo de publicação é stub**: o passo "auditoria" do botão Publicar Projeto não roda nenhuma verificação real (secret scanning, `npm audit`, etc.), só reporta que não foi implementado. Impacto: não dar falsa confiança de que algo foi checado.
- **`npm run test` assumido**: `src/lib/git/publish.ts` chama `npm run test` incondicionalmente; projetos conectados sem esse script vão falhar o passo — precisa de uma checagem de existência do script antes de rodar.

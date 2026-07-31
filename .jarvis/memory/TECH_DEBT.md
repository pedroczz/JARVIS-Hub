# TECH_DEBT — Jarvis Development Hub

_Débito técnico conhecido e seu impacto._

- **`npm audit`**: possíveis CVEs "high" vendored dentro do próprio `next`, sem fix não-breaking disponível no momento do scaffold. Impacto: nenhum vetor de exploração direto identificado (app roda local, sem exposição pública), mas deve ser revisado a cada bump de versão do Next.
- **Sem persistência de chat**: histórico de conversa vive só em memória do cliente (Zustand) — perdido ao recarregar a página ou trocar de projeto. Impacto: usuário perde contexto de sessões longas.
- **Auditoria do fluxo de publicação é stub**: o passo "auditoria" do botão Publicar Projeto não roda nenhuma verificação real (secret scanning, `npm audit`, etc.), só reporta que não foi implementado. Impacto: não dar falsa confiança de que algo foi checado.
- **`npm run test` assumido**: `src/lib/git/publish.ts` chama `npm run test` incondicionalmente; projetos conectados sem esse script vão falhar o passo — precisa de uma checagem de existência do script antes de rodar.

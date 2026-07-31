# MODULE 07 — EXCEL CONNECTOR

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, PROJECT_MANAGER, MEMORY_MANAGER, INVENTORY_MANAGER, WORKFLOW_ENGINE

---

# MISSÃO

Transformar uma planilha Excel na fonte oficial de dados do inventário. Toda alteração na planilha pode atualizar automaticamente o catálogo do site. O Excel vira o banco de dados operacional da empresa.

# FILOSOFIA

Usuário altera Excel → Jarvis valida → Inventory atualiza → Catálogo atualiza → Git commit → push → Vercel deploy. Nenhum produto é alterado manualmente no código.

# RESPONSABILIDADES

Importar/validar/sincronizar Excel, detectar alterações, exportar inventário, gerar JSON, gerar relatórios. Nunca gera páginas nem altera frontend.

# ESTRUTURA

```
excel/
  excel-service.ts
  excel-reader.ts
  excel-writer.ts
  excel-validator.ts
  excel-mapper.ts
  excel-schema.ts
  excel-watcher.ts
  excel-history.ts
```

# PLANILHA OFICIAL

Arquivo padrão `inventory.xlsx` em `/data/inventory.xlsx` (caminho configurável). Abas: Produtos, Categorias, Coleções, Fornecedores, Configurações, Histórico — nunca misturar informações.

# ABA PRODUTOS

Uma linha = um produto. Colunas: Serial, SKU, Nome, Categoria, Coleção, Material, Cor, Tamanho, Preço, Preço Promoção, Estoque, Fornecedor, Imagem Principal, Galeria, Descrição, Tags, Ativo, Observações.

Exemplo de linha: `AWP-000021 | SKU-2026-021 | Anel Solitário | Anéis | Clássicos | Prata 925 | Prata | 18 | 129.90 | 99.90 | 12 | Fornecedor A | /imagens/anel.jpg | /imagens/1.jpg;/2.jpg | Anel elegante... | Presente;Luxo | TRUE`

# LEITURA / ESCRITA

Leitura: validar → normalizar → gerar objetos → enviar ao Inventory — nunca modifica a planilha diretamente. Escrita: exportar alterações, atualizar estoque/preço, gerar backup.

# WATCH MODE

Opcional: monitora alterações na planilha; ao detectar, pergunta "Deseja atualizar o catálogo?" — nunca publica automaticamente.

# VALIDAÇÃO / ERROS / NORMALIZAÇÃO

Validar serial, SKU, nome, categoria, preço, imagem, estoque, duplicidades, tipos, campos obrigatórios. Erros mostram linha/coluna/valor/motivo/sugestão — nunca interromper sem informar. Normaliza datas, números, moedas, booleanos, categorias, tags.

# IMAGENS / BACKUP

Valida que o arquivo existe, formato, extensão, tamanho — nunca aceita imagem inexistente. Antes de qualquer alteração, cria backup `inventory-yyyy-mm-dd-hh-mm.xlsx` — nunca sobrescreve backups.

# EXPORTAÇÃO / SINCRONIZAÇÃO

Exporta Excel/CSV/JSON/ODS. Fluxo de sync: Excel → Validação → Inventory → JSON → Website → Git → Deploy. JSON gerado em `/data/products.json` — nunca editado manualmente, sempre regenerado.

# DETECÇÃO DE ALTERAÇÕES / RESUMO

Detecta produto novo/removido, preço/estoque/imagem/categoria alterados. Após sincronizar, mostra resumo: adicionados/removidos/atualizados/erros/avisos/tempo.

# EVENTOS PUBLICADOS

ExcelImported, ExcelValidated, ExcelExported, InventorySynchronized, JsonGenerated, SpreadsheetChanged, BackupCreated.

# EVENTOS CONSUMIDOS

ProjectOpened, SyncRequested, PublishRequested, InventoryUpdated.

# API PÚBLICA

`import() export() validate() backup() watch() sync() generate() history() status()`

# DASHBOARD

Última sincronização/importação/backup, quantidade de produtos, erros, avisos.

# SEGURANÇA

Nunca modifica a planilha sem autorização; sempre cria backup; nunca apaga linhas automaticamente.

# PERFORMANCE

Importação incremental, cache, leitura parcial, validação paralela.

# FUTURO

Google Sheets, LibreOffice, Microsoft 365, ERP, APIs — sem alterar arquitetura.

# CRITÉRIO DE CONCLUSÃO

✔ Importação/Exportação · ✔ Backup · ✔ Watch Mode · ✔ JSON · ✔ Validação · ✔ Dashboard · ✔ Eventos · ✔ Sincronização.

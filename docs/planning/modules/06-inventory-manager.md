# MODULE 06 — INVENTORY MANAGER

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, PROJECT_MANAGER, MEMORY_MANAGER, AI_ENGINE, WORKFLOW_ENGINE

---

# MISSÃO

Administrar todo o inventário de um projeto — única fonte de verdade sobre produtos. Nenhum outro módulo modifica estoque diretamente.

# FILOSOFIA

Produtos pertencem ao Inventory. Catálogo pertence ao Catalog Manager. Website apenas consome dados.

# RESPONSABILIDADES

Cadastrar/editar/excluir produtos, gerenciar estoque, categorias, coleções, variações, preço, serial, fornecedor, status, histórico. Nunca gerar páginas nem executar deploy.

# ESTRUTURA

```
inventory/
  inventory-service.ts
  inventory-validator.ts
  inventory-importer.ts
  inventory-exporter.ts
  inventory-history.ts
  inventory-search.ts
  inventory-events.ts
  inventory-schema.ts
```

# PRODUTO

id, serial, sku, nome, categoria, coleção, material, cor, tamanho, peso, descrição, preço, custo, estoque, estoqueMinimo, ativo, fornecedor, imagemPrincipal, galeria, tags, createdAt, updatedAt.

# SERIAL / SKU

Serial único, nunca reutilizado (ex.: AWP-000001). SKU gerado automaticamente, configurável, nunca duplicado.

# STATUS / CATEGORIAS / COLEÇÕES

Status: ATIVO, ESGOTADO, EM_REPOSICAO, ARQUIVADO, RASCUNHO. Categorias configuráveis (ex.: Anéis, Colares, Brincos, Pulseiras, Conjuntos, Pratas, Promoções, Novidades). Coleções: criar/editar/arquivar/pesquisar.

# ESTOQUE / PREÇOS

Controlar quantidade atual/mínima/reservada/disponível. Preços: custo, venda, promocional, margem — nunca calculado no frontend.

# IMAGENS / TAGS / FORNECEDOR

Imagem principal + galeria + miniaturas + WebP + original — nunca no banco, só referências. Tags livres (presente, casamento, minimalista, luxo, lançamento, infantil, masculino). Fornecedor: nome, contato, código, prazo, observações.

# PESQUISA / HISTÓRICO

Buscar por nome/categoria/serial/SKU/fornecedor/coleção/tag. Histórico registra criação, alteração, mudança de estoque/preço, arquivamento — nunca perder histórico.

# IMPORTAÇÃO / EXPORTAÇÃO / VALIDAÇÃO

Importar de Excel/CSV/JSON/API/banco (arquitetura aberta a novas fontes). Exportar para Excel/CSV/JSON/PDF. Validar preço/serial/SKU/categoria/imagem/estoque — nunca permitir produtos inválidos.

# EVENTOS PUBLICADOS

ProductCreated, ProductUpdated, ProductDeleted, StockUpdated, PriceUpdated, CollectionCreated, ImportFinished, ExportFinished, InventoryValidated.

# EVENTOS CONSUMIDOS

ExcelImported, CatalogRequested, WorkflowStarted.

# API PÚBLICA

`create() update() delete() archive() restore() search() import() export() history() validate() stock() categories() collections()`

# DASHBOARD / AUTOMAÇÕES

Mostra produtos, categorias, estoque, baixo estoque, produtos novos/arquivados. Quando estoque atinge o mínimo: gera alerta — nunca altera automaticamente.

# SEGURANÇA

Nunca excluir produtos definitivamente — arquivar sempre que possível.

# PERFORMANCE

Indexar serial, SKU, categoria, nome, fornecedor, coleção.

# FUTURO

Supabase, Firebase, PostgreSQL, MySQL, MongoDB, SQLite — sem alterar arquitetura.

# CRITÉRIO DE CONCLUSÃO

✔ Cadastro · ✔ Estoque · ✔ Serial/SKU · ✔ Categorias/Coleções · ✔ Histórico · ✔ Importação/Exportação · ✔ Dashboard · ✔ Eventos.

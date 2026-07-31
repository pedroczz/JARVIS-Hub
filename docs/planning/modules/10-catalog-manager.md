# MODULE 10 — CATALOG MANAGER

Version: 2.0 · Status: PLANNED · Priority: CRITICAL · Depends on: CORE, WORKFLOW_ENGINE, INVENTORY_MANAGER, EXCEL_CONNECTOR, MEMORY_MANAGER, PROJECT_MANAGER

_Nota: Module 09 ainda não foi recebido — numeração tem um gap._

---

# MISSÃO

Transformar os dados do Inventory em conteúdo consumível pelo website. O catálogo nunca é editado manualmente — toda informação é derivada do Inventory.

# FILOSOFIA

Inventory → Catalog → Website → Cliente. O Website nunca é a fonte de verdade.

# RESPONSABILIDADES

Gerar catálogo, JSON, páginas, índices, filtros, pesquisa, SEO, imagens otimizadas. Nunca edita estoque nem altera preços.

# ESTRUTURA

```
catalog/
  catalog-service.ts
  catalog-builder.ts
  catalog-validator.ts
  catalog-generator.ts
  catalog-index.ts
  catalog-search.ts
  catalog-cache.ts
  catalog-images.ts
```

# ENTRADA / SAÍDA

Entrada: produtos do Inventory Manager — nunca lê Excel diretamente. Saída: `products.json`, `categories.json`, `collections.json`, `search-index.json`, `featured.json`, sitemap, SEO.

# PRODUTOS / SLUG

Cada produto no catálogo: id, slug, nome, categoria, coleção, preço, imagem, galeria, descrição, tags, SEO, status. Slug gerado automaticamente (ex.: `anel-prata-925-solitario`), nunca duplicado.

# CATEGORIAS / COLEÇÕES / RELACIONADOS / DESTAQUES

Categorias e coleções geradas automaticamente, nunca cadastradas manualmente. Produtos relacionados calculados por categoria/coleção/tags/material. Destaques: lançamentos, promoções, mais vendidos, favoritos.

# FILTROS / PESQUISA / CACHE

Filtros por categoria, preço, material, coleção, tags, disponibilidade. Índice de pesquisa instantânea, sem necessidade de banco. Cache com atualização incremental.

# SEO / IMAGENS / SITEMAP / URLS

SEO gerado automaticamente: title, description, keywords, OpenGraph, Twitter Card, Schema.org. Imagens: thumbnail, WebP, otimizada, placeholder blur, lazy loading. Sitemap e robots atualizados automaticamente. URLs sempre amigáveis, nunca IDs visíveis.

# VALIDAÇÃO / BUILD INCREMENTAL

Antes de gerar: verificar preço, imagem, categoria, slug, SEO. Quando só um produto muda, atualiza só esse produto — nunca reconstrói o catálogo inteiro.

# EVENTOS PUBLICADOS

CatalogRequested, CatalogGenerated, CatalogUpdated, CatalogPublished, SearchUpdated, SEOUpdated.

# EVENTOS CONSUMIDOS

InventoryUpdated, ExcelImported, WorkflowStarted.

# API PÚBLICA

`generate() update() rebuild() search() categories() collections() featured() seo() status()`

# DASHBOARD

Produtos, categorias, última geração/publicação, tempo.

# PERFORMANCE

Incremental, cache, paralelismo, compressão.

# FUTURO

Marketplace, app mobile, API pública, headless CMS — sem alterar arquitetura.

# CRITÉRIO DE CONCLUSÃO

✔ JSON · ✔ Pesquisa · ✔ SEO · ✔ Sitemap · ✔ Produtos relacionados · ✔ Incremental · ✔ Dashboard.

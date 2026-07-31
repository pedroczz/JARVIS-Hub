# =====================================================================
# JARVIS DEVELOPMENT HUB
# ARCHITECTURE
# =====================================================================

Version: 2.0

Este documento define a arquitetura oficial do Jarvis.

Nenhum módulo poderá violar esta arquitetura.

Toda implementação futura deverá consultar este documento antes de criar novos componentes.

---

# FILOSOFIA

Jarvis não é um chatbot.

Jarvis é um Sistema Operacional para Engenharia de Software.

A IA é apenas um componente.

Toda lógica crítica deverá existir independentemente do modelo de IA utilizado.

O sistema deve funcionar mesmo permitindo futuramente trocar Claude por GPT, Gemini ou outro modelo.

A IA nunca será responsável pela arquitetura do sistema.

Ela apenas toma decisões.

Toda execução pertence ao próprio Jarvis.

---

# PRINCÍPIOS

Separação absoluta de responsabilidades.

Baixo acoplamento.

Alta coesão.

Componentes pequenos.

Reutilização máxima.

Cada módulo possui apenas uma responsabilidade principal.

Nenhum módulo poderá conhecer detalhes internos de outro módulo.

Comunicação apenas através de Services ou Events.

---

# CAMADAS

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Nunca inverter essa ordem.

A UI nunca conversa diretamente com Infrastructure.

Sempre passar por Services.

---

# MÓDULOS PRINCIPAIS

Core

AI Engine

Project Manager

Workspace Manager

Memory Manager

Git Manager

Inventory Manager

Catalog Manager

Deploy Manager

Workflow Engine

Dashboard

Plugin System

Settings

Documentation

Todos são independentes.

---

# CORE

O Core é responsável por:

Inicialização.

Configuração.

Carregamento.

Eventos globais.

Registro de módulos.

Estado global.

Nenhum módulo poderá depender diretamente de outro.

Todos dependem apenas do Core.

---

# AI ENGINE

Responsável apenas por:

Planejamento.

Análise.

Explicação.

Geração de código.

Nunca executar ações diretamente.

Toda ação deverá passar pelo Workflow Engine.

---

# PROJECT MANAGER

Responsável por:

Cadastrar projetos.

Selecionar projeto ativo.

Abrir Workspace.

Detectar Framework.

Detectar Package Manager.

Detectar Build.

Detectar Git.

Detectar Deploy.

Cada projeto possui configuração própria.

---

# WORKSPACE MANAGER

Responsável por:

Abrir projetos.

Salvar arquivos.

Criar arquivos.

Mover arquivos.

Excluir arquivos.

Monitorar alterações.

Nunca modificar arquivos fora do Workspace ativo.

---

# MEMORY MANAGER

Cada projeto possui memória própria.

Guardar:

Arquitetura.

Objetivos.

Tecnologias.

Regras.

Fluxos.

Padrões.

Decisões.

A memória nunca poderá ser compartilhada entre projetos.

---

# GIT MANAGER

Único responsável por:

Status.

Commit.

Push.

Pull.

Branches.

Checkout.

Merge.

Rebase.

Tags.

Logs.

Nunca permitir comandos Git fora dele.

---

# INVENTORY MANAGER

Responsável por:

Produtos.

Estoque.

Categorias.

Coleções.

Serial.

Preço.

Fornecedor.

Imagens.

Nunca gerar interface.

Apenas dados.

---

# EXCEL CONNECTOR

Responsável por:

Importar Excel.

Exportar Excel.

Validar planilhas.

Gerar modelos.

Converter Excel para objetos internos.

Nunca modificar catálogo diretamente.

---

# CATALOG MANAGER

Responsável por:

Gerar catálogo.

Atualizar catálogo.

Pesquisar.

Ordenar.

Categorias.

Produtos relacionados.

Nunca alterar estoque.

---

# IMAGE MANAGER

Responsável por:

Redimensionar.

Converter WebP.

Criar Thumbnails.

Compressão.

Renomeação.

Organização.

Nunca alterar produtos.

---

# DEPLOY MANAGER

Responsável por:

Build.

Lint.

Testes.

Auditoria.

Push.

Deploy.

Rollback.

Nunca gerar código.

---

# DASHBOARD

A Dashboard nunca implementa lógica.

Ela apenas apresenta dados.

Toda informação vem dos Services.

---

# WORKFLOW ENGINE

Todo comando do usuário passa obrigatoriamente pelo Workflow Engine.

Fluxo:

Usuário

↓

IA

↓

Workflow

↓

Validação

↓

Execução

↓

Resultado

Nunca permitir que a IA execute ações diretamente.

---

# SERVICES

Toda lógica deverá estar em Services.

Nunca na UI.

Nunca em Components.

Nunca em Pages.

Services são reutilizáveis.

---

# EVENTS

Módulos comunicam-se por eventos.

Exemplo:

InventoryUpdated

↓

CatalogUpdated

↓

BuildStarted

↓

DeployStarted

Nunca chamar módulos diretamente quando um evento resolver.

---

# CONFIGURAÇÃO

Cada projeto possuirá:

project.json

Contendo:

Nome.

Framework.

Deploy.

Git.

Banco.

Memória.

Permissões.

Nunca usar valores fixos.

---

# DADOS

Dados permanentes:

Workspace.

Git.

Configurações.

Projetos.

Memória.

Dados temporários:

Chat.

Logs temporários.

Execuções.

Sempre separar.

---

# SEGURANÇA

Nenhum módulo poderá executar:

Push.

Delete.

Reset.

Deploy.

Sem autorização.

Toda ação destrutiva exige confirmação.

---

# TOKENS

Sempre reutilizar documentação.

Nunca repetir arquitetura.

Consultar primeiro.

Implementar depois.

---

# FUTURO

A arquitetura deverá permitir adicionar:

Supabase

Firebase

Docker

Kubernetes

Azure

AWS

GitHub Actions

GitLab CI

Banco SQL

Banco NoSQL

Múltiplos modelos de IA

Sem alterar o núcleo.

---

# REGRA MAIS IMPORTANTE

Todo novo módulo deverá responder:

Qual responsabilidade possui?

Quem consome seus serviços?

Quais eventos produz?

Quais eventos consome?

Se essas perguntas não puderem ser respondidas claramente,

o módulo está errado.

Nunca implementar antes de responder essas quatro perguntas.

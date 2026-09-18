# Voucher Rest

Sistema intuitivo para gestão e controle de vouchers de restaurante, com emissão, rastreamento de vencimento, status do voucher e experiência de gestão em painel.

## Visão geral

Este projeto foi estruturado como uma aplicação Base44 + Vite React para gerenciar vouchers de restaurante com fluxo de autenticação, rotas protegidas e dashboard de acompanhamento.

## Funcionalidades

- Cadastro e listagem de vouchers
- Status por vencimento, cancelado, resgatado e ativo
- Filtros por estado e busca por texto
- Banner de vouchers próximos do vencimento
- Fluxo de autenticação e páginas públicas/privadas
- Estrutura pronta para uso com Base44 e Vite

## Stack

- React
- Vite
- Tailwind CSS
- Base44 SDK
- React Router
- TanStack Query

## Requisitos

1. Node.js e npm instalados
2. Base44 CLI opcional para o fluxo local do app
3. Deno, quando for usar o backend local do Base44

## Como rodar localmente

```bash
npm install
npm run build
npm run dev
```

Para o fluxo recomendado do Base44:

```bash
base44 login
base44 link
base44 dev
```

## Base44 notes

- Cada clone novo precisa executar `base44 link` para registrar o app local.
- O arquivo [base44/config.jsonc](base44/config.jsonc) define as tarefas de instalação, build e serve do projeto.
- O frontend do Base44 depende do app id e da URL base do app configurados no ambiente.
- O diretório de saída da build é `./dist`.

## Estrutura principal

- [src/App.jsx](src/App.jsx) — roteamento principal e autenticação
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx) — contexto de autenticação
- [src/components/voucher](src/components/voucher) — componentes do módulo de vouchers
- [src/pages](src/pages) — páginas públicas e privadas
- [base44/config.jsonc](base44/config.jsonc) — configuração do Base44

## Publicar alterações

Ao subir para o GitHub, o projeto pode ser sincronizado com o Base44 e publicado pelo dashboard da plataforma.

## Docs & suporte

- Base44: https://docs.base44.com/
- GitHub integration: https://docs.base44.com/developers/app-code/local-development/github
- Local dev overview: https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview

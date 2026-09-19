# Voucher Rest

Sistema para gestão e controle de vouchers de restaurante, com emissão, rastreamento de vencimento, status do voucher e acompanhamento em painel.

## Visão geral

Este projeto é uma aplicação React + Vite para gerenciar vouchers de restaurante com fluxo de autenticação local, rotas protegidas e dashboard de acompanhamento.

## Funcionalidades

- Cadastro e listagem de vouchers
- Status por vencimento, cancelado, resgatado e ativo
- Filtros por estado e busca por texto
- Banner de vouchers próximos do vencimento
- Fluxo de autenticação local com backend mínimo
- Estrutura pronta para uso em desenvolvimento local

## Stack

- React
- Vite
- Tailwind CSS
- Express
- React Router
- TanStack Query

## Requisitos

1. Node.js e npm instalados
2. Dependências do projeto instaladas

## Como rodar localmente

```bash
npm install
npm run dev
```

## Estrutura principal

- [src/App.jsx](src/App.jsx) — roteamento principal e autenticação
- [src/lib/AuthContext.jsx](src/lib/AuthContext.jsx) — contexto de autenticação
- [src/components/voucher](src/components/voucher) — componentes do módulo de vouchers
- [src/pages](src/pages) — páginas públicas e privadas
- [server/index.js](server/index.js) — backend mínimo para autenticação local

## Publicar alterações

Para publicar, basta subir o projeto em sua plataforma preferida e manter o servidor local ou um backend equivalente em produção.

## Docs & suporte

- Vite: https://vite.dev/
- React: https://react.dev/
- Express: https://expressjs.com/

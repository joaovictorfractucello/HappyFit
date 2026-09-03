# HappyFit

Aplicativo mobile para criar, executar e acompanhar treinos de academia, com foco total na experiência durante o próprio treino.

## O problema que resolve

Anotações soltas, planilhas ou apps genéricos não encaixam bem no momento em que mais importa: durante a execução do treino, na academia, com pouco tempo entre séries. O HappyFit é desenhado pra esse momento específico.

## Princípios

- **Rapidez** — poucos toques para qualquer ação
- **Simplicidade** — sem formulários gigantes, sem telas desnecessárias
- **Mobile nativo** — sem concessões de UX que uma versão web exigiria
- **Modo Treino focado** — durante a execução, a tela mostra só o essencial: série atual, carga, repetições, descanso
- **Evolução real** — histórico completo de cada sessão executada

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Flutter + Dart |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma (com migrations) |
| Banco de dados | PostgreSQL (Neon) |
| Comunicação | REST API (HTTP/JSON) |
| Autenticação | JWT |

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitetura em camadas e aplicação de SOLID
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — entidades e relacionamentos
- [`docs/API.md`](docs/API.md) — rotas da API
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — cores, tipografia, espaçamento
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — decisões técnicas e o porquê de cada uma

## Como rodar (backend)

Pré-requisitos: Node.js 20+ e uma string de conexão PostgreSQL (o projeto usa Neon).

```bash
cd backend
npm install                 # instala deps e gera o Prisma Client (postinstall)
cp .env.example .env        # preencha DATABASE_URL, DIRECT_URL e JWT_SECRET
npm run prisma:migrate      # aplica as migrations no banco
npm run dev                 # sobe em http://localhost:3333
```

Verificação rápida: `GET http://localhost:3333/health` deve responder `{ "status": "ok" }`.

Depois de editar `prisma/schema.prisma`, rode `npm run prisma:generate` para regenerar o client (`npm run prisma:migrate` já faz isso ao criar uma migration).

O frontend Flutter ainda não foi iniciado — ver `docs/DECISIONS.md`.

## Escopo do MVP

O MVP é intencionalmente enxuto — cobre o ciclo completo (criar treino → executar → ver histórico) sem funcionalidades que não afetam o uso essencial. Detalhes e roadmap completo em `docs/DECISIONS.md`.

## Status

Em desenvolvimento. Projeto pessoal com duplo propósito: ferramenta de uso real e portfólio técnico (arquitetura, segurança, boas práticas).

## Como esse projeto foi construído
 
Esse projeto foi desenvolvido com apoio de IA (Claude) como par de programação — planejamento, explicações e geração de código assistida, guiado pelo `CLAUDE.md` neste repositório.
 
As decisões de produto e arquitetura são minhas: escopo do MVP, modelagem de dados, separação de camadas, stack, estratégia de autenticação e os trade-offs registrados em `docs/DECISIONS.md` foram discutidos, questionados e ajustados por mim durante o desenvolvimento — não aceitos de forma automática. Uso IA como ferramenta para acelerar execução e aprender tecnologias novas (Flutter, TypeScript) mais rápido, não como substituto de entendimento.
 
Considero isso parte do meu processo de trabalho, e não um atalho — por isso está documentado aqui, aberto, em vez de escondido.
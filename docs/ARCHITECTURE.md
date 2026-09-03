# Arquitetura do backend

## Visão geral

O backend segue arquitetura em camadas, com responsabilidades bem separadas:

```
Cliente (Flutter)
      ↓
   Routes        → define os endpoints, zero lógica
      ↓
  Middlewares    → auth (JWT) e validação de entrada (Zod) antes do Controller
      ↓
  Controllers    → traduz HTTP ↔ domínio, mapeia erros em status code
      ↓
   Services      → regra de negócio pura, não conhece HTTP nem SQL
      ↓
 Repositories    → acesso a dados via Prisma, não conhece regra de negócio
      ↓
  PostgreSQL (Neon)
```

## Responsabilidade de cada camada

**Routes** — só mapeia URL + método HTTP para uma função de Controller.

**Controllers** — ponto de tradução entre o mundo HTTP e o mundo do domínio. Extrai dados do `req` (já validados pelo middleware), chama o Service, e traduz o resultado (ou erro lançado) em uma resposta HTTP (status code + JSON).

**Services** — onde vive a regra de negócio. Recebe dados simples, devolve dados simples ou lança erros de domínio (ex: `WorkoutNotFoundError`). Nunca importa `req`/`res`. Pode ser testado sem simular uma requisição HTTP.

**Repositories** — única camada que fala com o Prisma/banco. Expõe funções como `findById`, `create`, `update`. Se um dia o banco mudar, só essa camada é afetada.

**Middlewares** — interceptam a requisição antes do Controller (`auth.middleware` verifica JWT; `validate` valida corpo/params contra um schema Zod) ou capturam erros depois de tudo (`errorHandler`).

**Schemas** (`src/schemas/`) — schemas Zod que definem o formato de entrada de cada rota. São a fronteira entre dado não confiável (o que chega no `req`) e dado confiável (o que o Service recebe).

**Errors** (`src/errors/`) — classes de erro de domínio (`DomainError` e derivados). Ver "Erros de domínio" abaixo.

## Estrutura de pastas

```
backend/
├── prisma/                 # fora de src/ — convenção do Prisma (raiz do projeto)
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── schemas/            # schemas Zod de entrada (ex: auth.schema.ts)
    ├── errors/             # erros de domínio (DomainError e derivados)
    ├── middlewares/
    │   ├── auth.middleware.ts
    │   ├── validate.ts
    │   ├── rateLimit.ts
    │   └── errorHandler.ts
    └── config/
        └── prisma.ts       # instancia o PrismaClient (adapter pg)
```

## Aplicação de SOLID (pragmática, não acadêmica)

O projeto aplica os princípios de SOLID que geram valor real no tamanho atual do sistema, sem abstração por abstração.

- **Single Responsibility** — cada camada, cada arquivo, uma responsabilidade clara. Reflete-se diretamente na separação de pastas acima.
- **Dependency Inversion** — Controllers dependem de Services, Services dependem de Repositories — nunca o contrário, e nunca "pulando" uma camada.

Open/Closed, Liskov e Interface Segregation não são forçados nesta fase — eles ganham valor real quando existem múltiplas implementações intercambiáveis de algo (ex: múltiplos provedores de notificação). Introduzir interfaces genéricas antes de existir essa necessidade é complexidade sem benefício.

## Validação de entrada

Toda entrada da API é validada **antes** de chegar ao Controller, por um middleware `validate` genérico que recebe um schema Zod. O que passa está garantidamente no formato certo e já vem tipado — o Service nunca precisa checar se um campo existe ou tem o tipo esperado.

- Os schemas vivem em `src/schemas/`, um por área (ex: `auth.schema.ts`).
- O tipo de entrada de cada rota é derivado do schema (`z.infer`), não escrito à mão — schema e tipo nunca divergem.
- Falha de validação retorna `400` com a lista de campos inválidos, no envelope de erro padrão (ver `API.md`).

Zod (e não `express-validator` / `joi`): valida e infere o tipo TypeScript no mesmo lugar, combinando com o resto do backend tipado.

## Erros de domínio

Services lançam erros específicos do domínio (não status HTTP). Exemplos:

- `InvalidCredentialsError`
- `WorkoutNotFoundError`
- `SessionNotFoundError`
- `UnauthorizedAccessError` (usuário tentando acessar recurso de outro usuário)

O Controller (ou um `errorHandler` central) mapeia cada erro de domínio para o status HTTP correspondente.

## Isolamento entre usuários

Todo recurso pertencente a um usuário (`Workout`, `WorkoutSession` e o que pende deles) só pode ser lido ou alterado pelo próprio dono. Regras:

- O `id` do usuário vem **sempre** do JWT verificado (`req.user.id`), nunca do corpo ou da query da requisição.
- O Service recebe esse `userId` e o repassa ao Repository, que filtra por ele na própria query (`where: { id, userId }`) — não é um `findById` seguido de um `if` no Service, é condição de banco.
- `WorkoutSession` carrega `user_id` direto (desnormalizado), então a checagem de posse de uma sessão não precisa de join com `Workout`.
- Recurso de outro usuário responde `404` (não `403`) — não confirma que o `id` existe.

## SQL e segurança

O acesso a dados usa Prisma, que gera queries parametrizadas por padrão — proteção contra SQL Injection é automática. Nenhuma query é construída por concatenação de string em nenhuma camada do sistema.

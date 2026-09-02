# Arquitetura do backend

## Visão geral

O backend segue arquitetura em camadas, com responsabilidades bem separadas:

```
Cliente (Flutter)
      ↓
   Routes        → define os endpoints, zero lógica
      ↓
  Controllers    → recebe/valida requisição HTTP, traduz erros em status code
      ↓
   Services      → regra de negócio pura, não conhece HTTP nem SQL
      ↓
 Repositories    → acesso a dados via Prisma, não conhece regra de negócio
      ↓
  PostgreSQL (Neon)
```

## Responsabilidade de cada camada

**Routes** — só mapeia URL + método HTTP para uma função de Controller.

**Controllers** — ponto de tradução entre o mundo HTTP e o mundo do domínio. Extrai dados do `req`, chama o Service, e traduz o resultado (ou erro lançado) em uma resposta HTTP (status code + JSON).

**Services** — onde vive a regra de negócio. Recebe dados simples, devolve dados simples ou lança erros de domínio (ex: `WorkoutNotFoundError`). Nunca importa `req`/`res`. Pode ser testado sem simular uma requisição HTTP.

**Repositories** — única camada que fala com o Prisma/banco. Expõe funções como `findById`, `create`, `update`. Se um dia o banco mudar, só essa camada é afetada.

**Middlewares** — interceptam a requisição antes do Controller (`auth.middleware`, verifica JWT) ou capturam erros depois de tudo (`errorHandler`).

## Estrutura de pastas

```
src/
├── routes/
├── controllers/
├── services/
├── repositories/
├── middlewares/
│   ├── auth.middleware.ts
│   └── errorHandler.ts
├── config/
│   └── database.ts
└── prisma/
    └── schema.prisma
```

## Aplicação de SOLID (pragmática, não acadêmica)

O projeto aplica os princípios de SOLID que geram valor real no tamanho atual do sistema, sem abstração por abstração.

- **Single Responsibility** — cada camada, cada arquivo, uma responsabilidade clara. Reflete-se diretamente na separação de pastas acima.
- **Dependency Inversion** — Controllers dependem de Services, Services dependem de Repositories — nunca o contrário, e nunca "pulando" uma camada.

Open/Closed, Liskov e Interface Segregation não são forçados nesta fase — eles ganham valor real quando existem múltiplas implementações intercambiáveis de algo (ex: múltiplos provedores de notificação). Introduzir interfaces genéricas antes de existir essa necessidade é complexidade sem benefício.

## Erros de domínio

Services lançam erros específicos do domínio (não status HTTP). Exemplos:

- `InvalidCredentialsError`
- `WorkoutNotFoundError`
- `SessionNotFoundError`
- `UnauthorizedAccessError` (usuário tentando acessar recurso de outro usuário)

O Controller (ou um `errorHandler` central) mapeia cada erro de domínio para o status HTTP correspondente.

## SQL e segurança

O acesso a dados usa Prisma, que gera queries parametrizadas por padrão — proteção contra SQL Injection é automática. Nenhuma query é construída por concatenação de string em nenhuma camada do sistema.

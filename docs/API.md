# API — Rotas

Base: `/api/v1`
Autenticação: JWT no header `Authorization: Bearer <token>`. Token de acesso expira em 7 dias (sem refresh token no MVP — ver `DECISIONS.md`).

## Envelope de resposta

**Sucesso** — o corpo é o recurso (ou lista de recursos) direto, sem wrapper.

**Erro** — sempre no formato:

```json
{
  "error": {
    "code": "EMAIL_ALREADY_IN_USE",
    "message": "Este email já está em uso.",
    "details": [
      { "field": "email", "message": "Email inválido." }
    ]
  }
}
```

- `code` — string estável, em `SCREAMING_SNAKE_CASE`, para o cliente ramificar lógica sem depender do texto.
- `message` — texto pronto para exibir ao usuário.
- `details` — presente só em erro de validação (`400`); lista os campos que falharam.

Toda resposta `4xx`/`5xx` segue esse envelope, incluindo as de rate limit e as de erro interno.

## Auth

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cria conta (`name`, `email`, `password`) |
| POST | `/auth/login` | Não | Valida credenciais, devolve JWT |

**`POST /auth/register`** — `201` `{ id, name, email }` · `400` validação · `409` `EMAIL_ALREADY_IN_USE` · `429` rate limit (10/hora por IP)

**`POST /auth/login`** — `200` `{ token, user: { id, name, email } }` · `400` validação · `401` `INVALID_CREDENTIALS` (mesma resposta para email inexistente e senha errada, com timing equalizado) · `429` rate limit (10/15min por email)

## Users

| Método | Rota | Login | Descrição |
|---|---|---|---|
| GET | `/users/me` | Sim | Dados do usuário logado |

**`GET /users/me`** — `200` `{ id, name, email, createdAt }` · `401`

## Exercises

| Método | Rota | Login | Descrição |
|---|---|---|---|
| GET | `/exercises` | Sim | Lista exercícios disponíveis (biblioteca fixa) |

**`GET /exercises`** — `200` `[ { id, name, muscleGroup } ]` · `401`

## Workouts

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/workouts` | Sim | Cria treino com exercícios, ordem, séries, reps, carga |
| GET | `/workouts` | Sim | Lista treinos do usuário |
| GET | `/workouts/:id` | Sim | Detalhe do treino |
| PUT | `/workouts/:id` | Sim | Atualiza treino |
| DELETE | `/workouts/:id` | Sim | Remove treino (hard delete; sessões passadas sobrevivem) |

- `POST` — `201` treino criado · `400` · `401`
- `GET` (lista) — `200` · `401`
- `GET /:id` — `200` · `401` · `404` (inclui o caso "treino de outro usuário")
- `PUT /:id` — `200` · `400` · `401` · `404`. Editar o treino **não** altera sessões já executadas (ver `DATA_MODEL.md`).
- `DELETE /:id` — `204` · `401` · `404`

## Sessions (execução do treino)

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/workouts/:id/sessions` | Sim | Inicia uma sessão a partir de um treino |
| POST | `/sessions/:id/sets` | Sim | Registra uma série realizada |
| PATCH | `/sessions/:id/sets/:setId` | Sim | Corrige peso/reps de uma série já registrada |
| PATCH | `/sessions/:id` | Sim | Finaliza a sessão |
| DELETE | `/sessions/:id` | Sim | Cancela uma sessão **em andamento** |
| GET | `/sessions` | Sim | Histórico de sessões do usuário |
| GET | `/sessions/:id` | Sim | Detalhe da sessão, com séries realizadas |

- `POST /workouts/:id/sessions` — `201` sessão criada. O servidor grava `startedAt` e copia o snapshot (nome do treino + config planejada de cada exercício). · `401` · `404` · `409` `SESSION_IN_PROGRESS` se o usuário já tem uma sessão aberta
- `POST /sessions/:id/sets` — `201` · `400` · `401` · `404` · `409` `SESSION_ALREADY_FINISHED`
- `PATCH /sessions/:id/sets/:setId` — `200` · `400` · `401` · `404`. Permitido mesmo com a sessão já finalizada — é o mecanismo de correção do histórico.
- `PATCH /sessions/:id` — `200` `{ ..., endedAt, durationMinutes }`. O servidor grava `endedAt` e calcula `durationMinutes` (`endedAt − startedAt`); o cliente não envia duração. · `401` · `404` · `409` `SESSION_ALREADY_FINISHED`
- `DELETE /sessions/:id` — `204` se a sessão estiver em andamento · `401` · `404` · `409` `SESSION_ALREADY_FINISHED` (sessão finalizada é histórico, não se exclui)
- `GET /sessions` — `200` lista, mais recentes primeiro · `401`
- `GET /sessions/:id` — `200` · `401` · `404`

## Fora do MVP (planejado para v1.1+)

- `POST /auth/refresh` — refresh token
- Exercício personalizado por usuário
- Reordenar exercícios dentro de um treino já criado
- Pausar/retomar timer de descanso durante a sessão

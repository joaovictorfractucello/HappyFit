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
| POST | `/workouts` | Sim | Cria treino com exercícios, séries, reps, carga |
| GET | `/workouts` | Sim | Lista treinos do usuário |
| GET | `/workouts/:id` | Sim | Detalhe do treino |
| PUT | `/workouts/:id` | Sim | Substitui o treino inteiro (nome + exercícios) |
| DELETE | `/workouts/:id` | Sim | Remove treino (hard delete; sessões passadas sobrevivem) |

**Corpo de `POST`/`PUT`** — `{ name, exercises: [{ exerciseId, sets, reps, load }] }`. Sem campo `order`: a ordem de cada exercício é a posição dele no array, não algo que o cliente informa à parte. `PUT` recebe o mesmo formato e **substitui** nome e exercícios por completo (não é update parcial) — os `WorkoutExercise` antigos são apagados e recriados a partir do que veio no corpo.

**`POST /workouts`** — `201` `{ id, name, exercises: [{ id, order, sets, reps, load, exercise: { id, name, muscleGroup } }] }` · `400` `VALIDATION_ERROR` · `400` `INVALID_EXERCISE` (algum `exerciseId` não existe na biblioteca) · `401`

**`GET /workouts`** — `200` `[ { id, name, exerciseCount } ]` (lista enxuta; sem os exercícios detalhados) · `401`

**`GET /workouts/:id`** — `200` (mesmo formato de resposta do `POST`) · `400` `VALIDATION_ERROR` (`:id` não é um uuid) · `401` · `404` `WORKOUT_NOT_FOUND` (inclui o caso "treino de outro usuário" — nunca `403`, não confirma que o id existe)

**`PUT /workouts/:id`** — `200` (mesmo formato de resposta do `POST`) · `400` validação (corpo ou `:id`) · `401` · `404` `WORKOUT_NOT_FOUND`. Editar o treino **não** altera sessões já executadas (ver `DATA_MODEL.md`).

**`DELETE /workouts/:id`** — `204` sem corpo · `400` `VALIDATION_ERROR` (`:id` não é um uuid) · `401` · `404` `WORKOUT_NOT_FOUND`

## Sessions (execução do treino)

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/workouts/:id/sessions` | Sim | Inicia uma sessão a partir de um treino |
| GET | `/sessions` | Sim | Histórico de sessões do usuário |
| GET | `/sessions/:id` | Sim | Detalhe da sessão, com exercícios e séries |
| POST | `/sessions/:id/sets` | Sim | Registra uma série realizada |
| PATCH | `/sessions/:id/sets/:setId` | Sim | Corrige peso/reps de uma série já registrada |
| PATCH | `/sessions/:id` | Sim | Finaliza a sessão |
| DELETE | `/sessions/:id` | Sim | Cancela uma sessão **em andamento** |

**Formato do detalhe de uma sessão** (resposta de `POST /workouts/:id/sessions`, `GET /sessions/:id` e `PATCH /sessions/:id`):

```json
{
  "id": "uuid", "workoutId": "uuid|null", "workoutName": "Treino A",
  "startedAt": "...", "endedAt": "...|null", "durationMinutes": "int|null",
  "exercises": [
    { "id": "uuid", "order": 0,
      "plannedSets": 4, "plannedReps": 10, "plannedLoad": 40,
      "exercise": { "id": "uuid", "name": "Supino reto", "muscleGroup": "Peito" },
      "sets": [ { "id": "uuid", "setNumber": 1, "loadDone": 40, "repsDone": 10 } ] }
  ]
}
```

`workoutId`/`workoutName`/`plannedSets`/`plannedReps`/`plannedLoad` são o **snapshot**: copiados do treino no instante em que a sessão começa, e congelados a partir daí — editar ou apagar o treino depois não muda nada aqui (ver `DATA_MODEL.md`). `workoutId` vira `null` se o treino de origem for apagado; `workoutName` continua preservado.

**`POST /workouts/:id/sessions`** — sem corpo. `201` (formato acima, `exercises[].sets: []`) · `400` `VALIDATION_ERROR` (`:id` não é um uuid) · `401` · `404` `WORKOUT_NOT_FOUND` · `409` `SESSION_IN_PROGRESS` se o usuário já tem uma sessão aberta (checagem por usuário, não por treino)

**`GET /sessions`** — `200` `[ { id, workoutId, workoutName, startedAt, endedAt, durationMinutes } ]`, mais recente primeiro; inclui a sessão em andamento (`endedAt: null`) se houver — é assim que o cliente descobre que existe uma pra retomar · `401`

**`GET /sessions/:id`** — `200` (formato do detalhe) · `400` `VALIDATION_ERROR` · `401` · `404` `SESSION_NOT_FOUND` (inclui "sessão de outro usuário")

**Corpo de `POST /sessions/:id/sets`** — `{ sessionExerciseId, loadDone, repsDone }`. Sem `setNumber`: o servidor calcula (`séries já registradas` + 1). `201` `{ id, sessionExerciseId, setNumber, loadDone, repsDone }` · `400` `VALIDATION_ERROR` · `401` · `404` `SESSION_NOT_FOUND` · `404` `SESSION_EXERCISE_NOT_FOUND` (o `sessionExerciseId` não pertence a esta sessão) · `409` `SESSION_ALREADY_FINISHED`

**Corpo de `PATCH /sessions/:id/sets/:setId`** — `{ loadDone, repsDone }`, os dois obrigatórios. `200` (mesmo formato do set) · `400` `VALIDATION_ERROR` · `401` · `404` `SESSION_NOT_FOUND` · `404` `SET_NOT_FOUND` (o `setId` não pertence a esta sessão). Permitido mesmo com a sessão já finalizada — é o mecanismo de correção do histórico.

**`PATCH /sessions/:id`** — sem corpo. `200` (formato do detalhe, com `endedAt` e `durationMinutes` preenchidos — `Math.round((endedAt − startedAt) / 60000)`; o cliente não envia duração) · `400` `VALIDATION_ERROR` · `401` · `404` `SESSION_NOT_FOUND` · `409` `SESSION_ALREADY_FINISHED`

**`DELETE /sessions/:id`** — `204` sem corpo, se a sessão estiver em andamento (hard delete) · `400` `VALIDATION_ERROR` · `401` · `404` `SESSION_NOT_FOUND` · `409` `SESSION_ALREADY_FINISHED` (sessão finalizada é histórico, não se cancela)

## Fora do MVP (planejado para v1.1+)

- `POST /auth/refresh` — refresh token
- Exercício personalizado por usuário
- Reordenar exercícios dentro de um treino já criado
- Pausar/retomar timer de descanso durante a sessão

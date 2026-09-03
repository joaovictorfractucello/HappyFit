# Modelo de dados

## Decisão central: Workout ≠ WorkoutSession

O planejamento de um treino (`Workout`) é separado da execução real dele (`WorkoutSession`). Isso permite ajustar a carga durante o treino sem alterar o planejamento original, e permite construir um histórico real de evolução.

Cada `WorkoutSession` é um **snapshot autossuficiente**: no momento em que a sessão começa, a configuração planejada de cada exercício (séries, repetições, carga) e o nome do treino são **copiados** para dentro da sessão. A partir daí, editar ou excluir o treino não afeta nenhuma sessão passada — o histórico é imutável. Ver `DECISIONS.md`.

## Identificadores

Todas as PKs são `uuid` versão 7 (`@default(uuid(7))` no Prisma): identificador de 128 bits com prefixo de timestamp. Não expõem contagem de registros nem permitem enumeração previsível pela API, e o prefixo de tempo mantém os `INSERT`s sequenciais no índice do banco (evita a fragmentação que o `uuid` v4 aleatório causa).

## Entidades

### User
Conta do usuário no sistema.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| name | string |
| email | string (único) |
| password_hash | string |
| created_at | datetime |

### Exercise
Biblioteca fixa de exercícios disponíveis (sem exercício personalizado no MVP). Imutável em runtime — populada por seed.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| name | string |
| muscle_group | string |

### Workout
O planejamento — nome e lista ordenada de exercícios configurados.

Excluir um treino é um **hard delete**: a linha e suas `WorkoutExercise` são removidas. As sessões geradas a partir dele sobrevivem (ver `WorkoutSession`).

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| user_id | uuid (FK → User) |
| name | string |

### WorkoutExercise
Tabela de ligação entre `Workout` e `Exercise`, guardando a configuração planejada (ordem, séries, repetições, carga) daquele exercício dentro daquele treino. Existe porque o mesmo exercício pode aparecer em treinos diferentes com configurações diferentes.

Não é referenciada por `SetLog` — o histórico de execução aponta para o snapshot (`SessionExercise`), não para o plano.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| workout_id | uuid (FK → Workout) |
| exercise_id | uuid (FK → Exercise) |
| order | int |
| sets | int |
| reps | int |
| load | float |

### WorkoutSession
Uma execução real de um treino.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| user_id | uuid (FK → User) — dono da sessão; permite checar posse sem join com `Workout` |
| workout_id | uuid (FK → Workout), nullable, `ON DELETE SET NULL` — vínculo com o treino de origem; vira `null` se o treino for excluído |
| workout_name | string — nome do treino copiado no início da sessão; preserva a identidade no histórico mesmo após a exclusão do treino |
| started_at | datetime — gravado pelo servidor ao iniciar a sessão |
| ended_at | datetime, nullable — gravado pelo servidor ao finalizar; `null` = sessão em andamento |
| duration_minutes | int, nullable — calculado no fechamento (`ended_at − started_at`) |

Uma sessão **em andamento** (`ended_at` null) pode ser excluída (tentativa abandonada). Uma sessão **finalizada** não pode ser excluída — correções são feitas série a série (`SetLog`).

### SessionExercise
O snapshot de cada exercício dentro de uma sessão. Criado no início da sessão, copiando a configuração planejada da `WorkoutExercise` correspondente. Congelado: edições posteriores no treino não o afetam.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| session_id | uuid (FK → WorkoutSession) |
| exercise_id | uuid (FK → Exercise) |
| order | int — ordem do exercício naquela sessão |
| planned_sets | int — meta copiada do plano |
| planned_reps | int — meta copiada do plano |
| planned_load | float — meta copiada do plano |

### SetLog
O que de fato aconteceu em cada série durante uma sessão.

| Campo | Tipo |
|---|---|
| id | uuid v7 (PK) |
| session_exercise_id | uuid (FK → SessionExercise) |
| set_number | int |
| load_done | float |
| reps_done | int |

## Relacionamentos

```
User             1─N  Workout
User             1─N  WorkoutSession
Workout          1─N  WorkoutExercise
Exercise         1─N  WorkoutExercise
Workout          1─N  WorkoutSession    (workout_id nullable: a sessão sobrevive à exclusão do treino)
WorkoutSession   1─N  SessionExercise
Exercise         1─N  SessionExercise
SessionExercise  1─N  SetLog
```

## Regra de imutabilidade do histórico

- Editar um `Workout` / `WorkoutExercise` afeta apenas sessões **futuras**.
- Excluir um `Workout` não afeta nenhuma sessão.
- `SessionExercise` e `SetLog` nunca são alterados por operações no plano — só por correção explícita de uma série (`PATCH /sessions/:id/sets/:setId`).

## Fora do escopo atual (deferido)

- Exercício personalizado por usuário (`Exercise.user_id` nullable) — planejado para v1.1, quando o campo pode ser adicionado sem quebrar o modelo atual

# Modelo de dados

## Decisão central: Workout ≠ WorkoutSession

O planejamento de um treino (`Workout`) é separado da execução real dele (`WorkoutSession`). Isso permite que o usuário ajuste a carga durante o treino sem alterar o planejamento original, e permite construir um histórico real de evolução — cada sessão é um snapshot do que de fato aconteceu naquele dia.

## Entidades

### User
Conta do usuário no sistema.

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| name | string |
| email | string |
| password_hash | string |

### Exercise
Biblioteca fixa de exercícios disponíveis (sem exercício personalizado no MVP).

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| name | string |
| muscle_group | string |

### Workout
O planejamento — nome e lista ordenada de exercícios configurados.

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| user_id | uuid (FK → User) |
| name | string |

### WorkoutExercise
Tabela de ligação entre `Workout` e `Exercise`, guardando a configuração específica (ordem, séries, repetições, carga) daquele exercício dentro daquele treino. Existe porque o mesmo exercício pode aparecer em treinos diferentes com configurações diferentes.

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| workout_id | uuid (FK → Workout) |
| exercise_id | uuid (FK → Exercise) |
| order | int |
| sets | int |
| reps | int |
| load | float |

### WorkoutSession
Uma execução real de um treino, numa data específica.

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| workout_id | uuid (FK → Workout) |
| date | datetime |
| duration_minutes | int |

### SetLog
O que de fato aconteceu em cada série durante uma sessão. Referencia `WorkoutExercise` (não `Exercise` diretamente) para preservar a configuração planejada que existia no momento da execução, mesmo que o treino seja editado depois.

| Campo | Tipo |
|---|---|
| id | uuid (PK) |
| session_id | uuid (FK → WorkoutSession) |
| workout_exercise_id | uuid (FK → WorkoutExercise) |
| set_number | int |
| load_done | float |
| reps_done | int |

## Relacionamentos

```
User 1—N Workout
Workout 1—N WorkoutExercise
Exercise 1—N WorkoutExercise
Workout 1—N WorkoutSession
WorkoutSession 1—N SetLog
WorkoutExercise 1—N SetLog
```

## Fora do escopo atual (deferido)

- Exercício personalizado por usuário (`Exercise.user_id` nullable) — planejado para v1.1, quando o campo pode ser adicionado sem quebrar o modelo atual

# API — Rotas

Base: `/api/v1`
Autenticação: JWT no header `Authorization: Bearer <token>`. Token de acesso expira em 7 dias (sem refresh token no MVP — ver `DECISIONS.md`).

## Auth

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cria conta (name, email, password) |
| POST | `/auth/login` | Não | Valida credenciais, devolve JWT |

## Users

| Método | Rota | Login | Descrição |
|---|---|---|---|
| GET | `/users/me` | Sim | Dados do usuário logado |

## Exercises

| Método | Rota | Login | Descrição |
|---|---|---|---|
| GET | `/exercises` | Sim | Lista exercícios disponíveis (biblioteca fixa) |

## Workouts

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/workouts` | Sim | Cria treino com exercícios, ordem, séries, reps, carga |
| GET | `/workouts` | Sim | Lista treinos do usuário |
| GET | `/workouts/:id` | Sim | Detalhe do treino |
| PUT | `/workouts/:id` | Sim | Atualiza treino |
| DELETE | `/workouts/:id` | Sim | Remove treino |

## Sessions (execução do treino)

| Método | Rota | Login | Descrição |
|---|---|---|---|
| POST | `/workouts/:id/sessions` | Sim | Inicia uma sessão a partir de um treino |
| POST | `/sessions/:id/sets` | Sim | Registra uma série realizada |
| PATCH | `/sessions/:id/sets/:setId` | Sim | Corrige peso/reps de uma série já registrada |
| PATCH | `/sessions/:id` | Sim | Finaliza a sessão (grava duração) |
| DELETE | `/sessions/:id` | Sim | Remove a sessão |
| GET | `/sessions` | Sim | Histórico de sessões do usuário |
| GET | `/sessions/:id` | Sim | Detalhe da sessão, com séries realizadas |

## Fora do MVP (planejado para v1.1+)

- `POST /auth/refresh` — refresh token
- Exercício personalizado por usuário
- Reordenar exercícios dentro de um treino já criado
- Pausar/retomar timer de descanso durante a sessão

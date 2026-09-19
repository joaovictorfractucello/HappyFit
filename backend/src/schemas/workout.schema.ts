import { z } from "zod";

const workoutExerciseSchema = z.object({
  exerciseId: z.uuid("ID de exercício inválido."),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(1).max(100),
  load: z.number().min(0).max(1000),
});

export const createWorkoutSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório.").max(100),
  exercises: z
    .array(workoutExerciseSchema)
    .min(1, "Adicione ao menos um exercício.")
    .max(30, "Máximo de 30 exercícios por treino."),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export const workoutIdParamsSchema = z.object({
  id: z.uuid("id inválido."),
});

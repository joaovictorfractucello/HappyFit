import { z } from "zod";

export const sessionIdParamsSchema = z.object({
  id: z.uuid("id inválido."),
});

export const setParamsSchema = z.object({
  id: z.uuid("id inválido."),
  setId: z.uuid("id da série inválido."),
});

export const addSetSchema = z.object({
  sessionExerciseId: z.uuid("id de exercício da sessão inválido."),
  loadDone: z.number().min(0).max(1000),
  repsDone: z.number().int().min(1).max(100),
});

export type AddSetInput = z.infer<typeof addSetSchema>;

export const updateSetSchema = z.object({
  loadDone: z.number().min(0).max(1000),
  repsDone: z.number().int().min(1).max(100),
});

export type UpdateSetInput = z.infer<typeof updateSetSchema>;

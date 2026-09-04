import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres.").max(100),
  email: z.string().trim().toLowerCase().pipe(z.email("Email inválido.")),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres.").max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Email inválido.")),
  password: z.string().min(1, "Senha é obrigatória.").max(72),
});

export type LoginInput = z.infer<typeof loginSchema>;

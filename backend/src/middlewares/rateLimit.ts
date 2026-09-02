import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 10,                 // 10 registros por IP na janela
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Muitas tentativas de cadastro. Tente novamente mais tarde." },
});
import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 10,                 // 10 registros por IP na janela
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Muitas tentativas de cadastro. Tente novamente mais tarde.",
    },
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10,                 // 10 tentativas por email na janela
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email;
    return typeof email === "string" ? email.trim().toLowerCase() : "unknown";
  },
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Muitas tentativas de login. Tente novamente mais tarde.",
    },
  },
});
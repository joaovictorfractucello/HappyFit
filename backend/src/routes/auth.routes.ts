import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit";

export const authRoutes = Router();

authRoutes.post(
    "/register",
    registerLimiter,
    validate(registerSchema),
    authController.register,
);

authRoutes.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    authController.login,
)
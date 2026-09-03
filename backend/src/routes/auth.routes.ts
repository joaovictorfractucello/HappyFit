import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../schemas/auth.schema";
import { registerLimiter } from "../middlewares/rateLimit";

export const authRoutes = Router();

authRoutes.post(
    "/register",
    registerLimiter,
    validate(registerSchema),
    authController.register,
);
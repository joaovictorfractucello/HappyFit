import { Router } from "express";
import { sessionController } from "../controllers/session.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateParams } from "../middlewares/validate";
import { sessionIdParamsSchema } from "../schemas/session.schema";

export const sessionRoutes = Router();

sessionRoutes.get("/:id", authMiddleware, validateParams(sessionIdParamsSchema), sessionController.getById);

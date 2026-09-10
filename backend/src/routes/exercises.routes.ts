import { Router } from "express";
import { exerciseController } from "../controllers/exercise.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const exerciseRoutes = Router();

exerciseRoutes.get("/", authMiddleware, exerciseController.list);

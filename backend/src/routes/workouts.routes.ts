import { Router } from "express";
import { workoutController } from "../controllers/workout.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createWorkoutSchema } from "../schemas/workout.schema";

export const workoutRoutes = Router();

workoutRoutes.post("/", authMiddleware, validate(createWorkoutSchema), workoutController.create);
workoutRoutes.get("/", authMiddleware, workoutController.list);


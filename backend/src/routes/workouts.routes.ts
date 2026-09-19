import { Router } from "express";
import { workoutController } from "../controllers/workout.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams } from "../middlewares/validate";
import { createWorkoutSchema, workoutIdParamsSchema } from "../schemas/workout.schema";

export const workoutRoutes = Router();

workoutRoutes.post("/", authMiddleware, validate(createWorkoutSchema), workoutController.create);
workoutRoutes.get("/", authMiddleware, workoutController.list);
workoutRoutes.get("/:id", authMiddleware, validateParams(workoutIdParamsSchema), workoutController.getById);
workoutRoutes.put(
  "/:id",
  authMiddleware,
  validateParams(workoutIdParamsSchema),
  validate(createWorkoutSchema),
  workoutController.update,
);
workoutRoutes.delete("/:id", authMiddleware, validateParams(workoutIdParamsSchema), workoutController.remove);


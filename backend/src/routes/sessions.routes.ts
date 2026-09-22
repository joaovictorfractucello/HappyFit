import { Router } from "express";
import { sessionController } from "../controllers/session.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate, validateParams } from "../middlewares/validate";
import {
  sessionIdParamsSchema,
  setParamsSchema,
  addSetSchema,
  updateSetSchema,
} from "../schemas/session.schema";

export const sessionRoutes = Router();

sessionRoutes.get("/", authMiddleware, sessionController.list);
sessionRoutes.get("/:id", authMiddleware, validateParams(sessionIdParamsSchema), sessionController.getById);
sessionRoutes.patch("/:id", authMiddleware, validateParams(sessionIdParamsSchema), sessionController.finish);
sessionRoutes.delete("/:id", authMiddleware, validateParams(sessionIdParamsSchema), sessionController.cancel);

sessionRoutes.post(
  "/:id/sets",
  authMiddleware,
  validateParams(sessionIdParamsSchema),
  validate(addSetSchema),
  sessionController.addSet,
);

sessionRoutes.patch(
  "/:id/sets/:setId",
  authMiddleware,
  validateParams(setParamsSchema),
  validate(updateSetSchema),
  sessionController.updateSet,
);

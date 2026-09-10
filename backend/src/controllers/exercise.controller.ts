import { Request, Response } from "express";
import { exerciseService } from "../services/exercise.service";

export const exerciseController = {
  async list(_req: Request, res: Response) {
    const exercises = await exerciseService.list();
    res.status(200).json(exercises);
  },
};

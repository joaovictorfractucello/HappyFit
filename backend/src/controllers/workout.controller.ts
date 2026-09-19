import { Request, Response } from "express";
import { workoutService } from "../services/workout.service";
import { UnauthorizedError } from "../errors";

export const workoutController = {
  async create(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const workout = await workoutService.create(req.user.id, req.body);
    res.status(201).json(workout);
  },

  async list(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const workouts = await workoutService.list(req.user.id);
    res.status(200).json(workouts);
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const workout = await workoutService.getById(req.user.id, req.params.id);
    res.status(200).json(workout);
  },

  async update(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const workout = await workoutService.update(req.user.id, req.params.id, req.body);
    res.status(200).json(workout);
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    await workoutService.remove(req.user.id, req.params.id);
    res.status(204).send();
  },
};

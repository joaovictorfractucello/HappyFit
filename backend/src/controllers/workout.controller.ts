import { Request, Response } from 'express';
import { workoutService } from '../services/workout.service';
import { UnauthorizedError } from '../errors';
import { create } from 'domain';

export const workoutController = { 
    async create(req: Request, res: Response) {
        if (!req.user) throw new UnauthorizedError();

        const workout = await workoutService.create(req.user.id, req.body);
        res.status(201).json(workout);
    },

    async list (req: Request, res: Response) {
        if (!req.user) throw new UnauthorizedError();

        const workouts = await workoutService.list(req.user.id);
        res.status(200).json(workouts);
    },
};
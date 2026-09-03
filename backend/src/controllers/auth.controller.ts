import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    async register(req: Request, res: Response) {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    }
}
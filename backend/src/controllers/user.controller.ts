import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { UnauthorizedError } from "../errors";

export const userController = {
  async getMe(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await userService.getMe(req.user.id);
    res.status(200).json(user);
  },
};

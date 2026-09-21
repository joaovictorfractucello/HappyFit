import { Request, Response } from "express";
import { sessionService } from "../services/session.service";
import { UnauthorizedError } from "../errors";

export const sessionController = {
  async start(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const session = await sessionService.start(req.user.id, req.params.id);
    res.status(201).json(session);
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const session = await sessionService.getById(req.user.id, req.params.id);
    res.status(200).json(session);
  },

  async addSet(req: Request<{ id: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const set = await sessionService.addSet(req.user.id, req.params.id, req.body);
    res.status(201).json(set);
  },

  async updateSet(req: Request<{ id: string; setId: string }>, res: Response) {
    if (!req.user) throw new UnauthorizedError();

    const set = await sessionService.updateSet(
      req.user.id,
      req.params.id,
      req.params.setId,
      req.body,
    );
    res.status(200).json(set);
  },
};

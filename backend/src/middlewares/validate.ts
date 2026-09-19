import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;
    next();
  };
}

// Igual à validate acima, mas pros parâmetros da URL (ex: o :id de /workouts/:id).
// Sem isso, um id mal formatado chega cru no banco e vira 500 em vez de 400.
export function validateParams(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(result.error);
    }

    req.params = result.data as typeof req.params;
    next();
  };
}
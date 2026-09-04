import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { DomainError } from "../errors";

const domainErrorStatus: Record<string, number> = {
  EMAIL_ALREADY_IN_USE: 409,
  INVALID_CREDENTIALS: 401,
};

function getClientErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;

  const status = (err as { status?: unknown }).status
    ?? (err as { statusCode?: unknown }).statusCode;

  return typeof status === "number" && status >= 400 && status < 500
    ? status
    : null;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos.",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (err instanceof DomainError) {
    const status = domainErrorStatus[err.code] ?? 400;
    res.status(status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  const clientErrorStatus = getClientErrorStatus(err);
  if (clientErrorStatus) {
    res.status(clientErrorStatus).json({
      error: {
        code: "BAD_REQUEST",
        message: "Requisição inválida.",
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Erro interno do servidor.",
    },
  });
}

// Estende o tipo `Request` do Express para incluir `req.user`,
// preenchido pelo auth.middleware depois de verificar o JWT.
// "declaration merging": o TypeScript junta esta declaração com a
// original do Express em vez de substituí-la.

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

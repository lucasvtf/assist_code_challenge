import type { NextFunction, Request, Response } from 'express';
import ApiErrors from '../utils/apiErrors';

const errorHandler = (
  error: ApiErrors | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error instanceof ApiErrors ? error.statusCode : 500;
  const message =
    error instanceof ApiErrors ? error.message : 'Internal Server Error';

  console.error('Erro:', {
    message: error.message,
    statusCode,
    stack: error.stack,
  });

  return res.status(statusCode).json({ message });
};

export default errorHandler;

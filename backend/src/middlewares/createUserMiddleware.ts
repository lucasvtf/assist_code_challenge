import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const createUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (username && username.length <= 5) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Invalid username.' });
  }

  if (password && password.length <= 3) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Invalid password.' });
  }

  next();
};

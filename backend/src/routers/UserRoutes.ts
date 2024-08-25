import { Router } from 'express';
import UserController from '../controllers/UserController';
import { createOrLoginMiddleware } from '../middlewares/createOrLoginMiddleware';

const userRoutes = Router();

userRoutes.post('/register', createOrLoginMiddleware, (req, res, next) =>
  new UserController(req, res, next).create(),
);

userRoutes.get('/profile', (req, res, next) =>
  new UserController(req, res, next).checkUser(),
);

userRoutes.post('/login', createOrLoginMiddleware, (req, res, next) =>
  new UserController(req, res, next).login(),
);

userRoutes.post('/logout', createOrLoginMiddleware, (req, res, next) =>
  new UserController(req, res, next).logout(),
);

userRoutes.get('/people', (req, res, next) =>
  new UserController(req, res, next).getUsers(),
);

export default userRoutes;

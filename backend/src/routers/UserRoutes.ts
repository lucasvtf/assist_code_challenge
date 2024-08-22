import { Router } from 'express';
import UserController from '../controllers/UserController';
import { createUserMiddleware } from '../middlewares/createUserMiddleware';
// import { loginMiddleware } from '../middlewares/loginMiddlware';

const userRoutes = Router();

userRoutes.post('/register', createUserMiddleware, (req, res, next) =>
  new UserController(req, res, next).create()
);

// userRoutes.post('/user/login', loginMiddleware, (req, res, next) =>
//   new UserController(req, res, next).login()
// );

export default userRoutes;

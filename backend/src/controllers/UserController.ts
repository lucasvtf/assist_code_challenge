import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type IUser from '../interfaces/IUser';
import UserService from '../services/UserService';
import { createToken, verifyToken } from '../utils/jwt';

export default class UserController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: UserService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new UserService();
  }

  public async create() {
    try {
      const user: IUser = this.req.body;
      const newUser = await this.service.create(user);
      const token = createToken({ id: newUser.id, username: newUser.username });

      return this.res
        .cookie('token', token)
        .status(StatusCodes.CREATED)
        .json(newUser);
    } catch (error) {
      this.next(error);
    }
  }

  public async checkUser() {
    try {
      const { token } = this.req.cookies;
      const userData = verifyToken(token);

      if (userData) {
        return this.res.json(userData);
      } else {
        return this.res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }
    } catch (error) {
      return this.next(error);
    }
  }

  public async login() {
    try {
      const user = this.req.body;
      const token = await this.service.login(user);
      return this.res
        .cookie('token', token)
        .status(StatusCodes.ACCEPTED)
        .json(user);
    } catch (error) {
      this.next(error);
    }
  }

  public async getUsers() {
    try {
      const users = await this.service.getUsers();
      return this.res.status(StatusCodes.OK).json(users);
    } catch (error) {
      this.next(error);
    }
  }

  public async logout() {
    try {
      return this.res
        .cookie('token', '')
        .status(StatusCodes.ACCEPTED)
        .json({ message: 'Successfully logged out!' });
    } catch (error) {
      this.next(error);
    }
  }
}

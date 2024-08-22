import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import IUser from '../interfaces/IUser';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

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
      const token = await this.service.create(user);
      return this.res
        .cookie('token', token)
        .status(StatusCodes.CREATED)
        .json(ReasonPhrases.CREATED);
    } catch (error) {
      this.next(error);
    }
  }

  //   public async login() {
  //     try {
  //       const user = this.req.body;
  //       const token = await this.service.login(user);
  //       return this.res.status(StatusCodes.ACCEPTED).json({ token });
  //     } catch (error) {
  //       this.next(error);
  //     }
  //   }
}

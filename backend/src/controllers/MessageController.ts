import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import MessageService from '../services/MessageService';
import ApiErrors from '../utils/apiErrors';
import { verifyToken } from '../utils/jwt';

export default class MessageController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: MessageService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new MessageService();
  }

  public async getAllMessagesById() {
    try {
      const userId = new Types.ObjectId(this.req.params.userId);
      const token = verifyToken(this.req.cookies.token);
      const ourUserId = new Types.ObjectId(token.id);
      const messages = await this.service.getAllMessagesById(userId, ourUserId);
      if (!messages)
        new ApiErrors('Messages not found.', StatusCodes.NOT_FOUND);
      return this.res.status(StatusCodes.OK).json(messages);
    } catch (error) {
      this.next(error);
    }
  }
}

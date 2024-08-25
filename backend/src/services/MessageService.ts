import type { Types } from 'mongoose';
import type IMessage from '../interfaces/IMessageModel';
import MessageModel from '../models/MessageModel';

export default class MessageService {
  private messageModel: MessageModel;

  constructor() {
    this.messageModel = new MessageModel();
  }

  public async create(message: IMessage): Promise<IMessage> {
    return this.messageModel.create(message);
  }

  public async getAllMessagesById(
    userId: Types.ObjectId,
    ourUserId: Types.ObjectId,
  ): Promise<IMessage[]> {
    const messages = await this.messageModel.find({
      $or: [
        { sender: userId, recipient: ourUserId },
        { sender: ourUserId, recipient: userId },
      ],
    });

    const sortedMessages = messages.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return sortedMessages;
  }
}

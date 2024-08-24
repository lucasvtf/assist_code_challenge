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
}

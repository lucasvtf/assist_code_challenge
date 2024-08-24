import { Schema } from 'mongoose';
import type IMessage from 'src/interfaces/IMessageModel';
import ModelExample from './Abstract';

export default class MessageModel extends ModelExample<IMessage> {
  constructor() {
    const schema = new Schema<IMessage>(
      {
        sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        recipient: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        text: { type: String, required: true },
      },
      { timestamps: true },
    );
    const modelName = 'messages';
    super(schema, modelName);
  }
}

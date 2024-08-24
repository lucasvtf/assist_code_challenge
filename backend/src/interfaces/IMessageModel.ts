import type { Types } from 'mongoose';

export default interface IMessage {
  id?: string;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
}

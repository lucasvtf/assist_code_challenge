import { Schema } from 'mongoose';
import IUser from '../interfaces/IUser';
import ModelExample from './Abstract';

export default class UserModel extends ModelExample<IUser> {
  constructor() {
    const schema = new Schema<IUser>(
      {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      },
      { timestamps: true }
    );
    const modelName = 'users';
    super(schema, modelName);
  }
}

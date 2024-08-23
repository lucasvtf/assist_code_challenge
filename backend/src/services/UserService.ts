import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import type IUser from '../interfaces/IUser';
import UserModel from '../models/UserModel';
import ApiErrors from '../utils/apiErrors';
import { createToken } from '../utils/jwt';

export default class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  public async create(user: IUser): Promise<Partial<IUser>> {
    const usernameExists = await this.userModel.findOne({
      username: user.username,
    });

    if (usernameExists)
      throw new ApiErrors(
        'Username already registered.',
        StatusCodes.FORBIDDEN,
      );
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    const newUser = await this.userModel.create(user);

    return {
      id: newUser.id,
      username: newUser.username,
    };
  }

  public async login(user: IUser): Promise<string> {
    const userLogin = await this.userModel.findOne({
      username: user.username,
    });
    console.log(userLogin)
    if (!userLogin)
      throw new ApiErrors('Wrong username.', StatusCodes.FORBIDDEN);

    const validPassword = await bcrypt.compare(
      user.password,
      userLogin.password,
    );

    if (!validPassword)
      throw new ApiErrors('Wrong password.', StatusCodes.FORBIDDEN);

    const token = createToken({
      id: userLogin.id,
      username: userLogin.username,
    });
    return token;
  }
}

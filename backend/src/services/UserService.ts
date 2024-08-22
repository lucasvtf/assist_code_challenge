import bcrypt from 'bcrypt';
import IUser from '../interfaces/IUser';
import UserModel from '../models/UserModel';
import { StatusCodes } from 'http-status-codes';
import { createToken } from '../utils/jwt';
import ApiErrors from '../utils/apiErrors';

export default class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  public async create(user: IUser): Promise<string> {
    const usernameExists = await this.userModel.find({
      username: user.username,
    });

    if (usernameExists.length > 0)
      throw new ApiErrors(
        'Username already registered.',
        StatusCodes.FORBIDDEN
      );
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    const newUser = await this.userModel.create(user);

    const token = createToken({ username: user.username });

    return token;
  }

  //   public async login(user: IUser): Promise<string> {
  //     const userLogin = await this.userModel.findByEmail(user.email);
  //     if (!userLogin) throw new ApiErrors('Wrong email.', StatusCodes.FORBIDDEN);

  //     const validPassword = await bcrypt.compare(
  //       user.password,
  //       userLogin.password
  //     );

  //     if (!validPassword)
  //       throw new ApiErrors('Wrong password.', StatusCodes.FORBIDDEN);

  //     const token = createToken({ email: userLogin.email });
  //     return token;
  //   }
}

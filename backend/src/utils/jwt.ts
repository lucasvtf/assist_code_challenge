import jwt from 'jsonwebtoken';
import 'dotenv/config';
import IJwt from '../interfaces/IJwt';

const secret = process.env.JWT_SECRET || 'assistchat';

const jwtConfig: jwt.SignOptions = {
  algorithm: 'HS256',
};

export const createToken = (payload: IJwt): string => {
  return jwt.sign(payload, secret, jwtConfig);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secret, jwtConfig);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

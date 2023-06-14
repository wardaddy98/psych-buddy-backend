import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../constants.js';

export const generateToken = (data, options = {}) => {
  const token = jwt.sign(data, JWT_SECRET_KEY, options);
  return token;
};

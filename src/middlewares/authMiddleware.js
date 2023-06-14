import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { JWT_SECRET_KEY } from '../constants.js';
import { User } from '../models/user.model.js';
import { handleResponse } from '../utils/handleResponse.js';

export const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return handleResponse(res, {
        type: 'UNAUTHORIZED',
        message: 'Missing access token',
      });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET_KEY, async (err, tokenData) => {
      if (err) {
        return handleResponse(res, {
          type: 'FORBIDDEN',
          message: 'Invalid token',
        });
      } else {
        //get user using userId from tokenData and set the user in req.user
        const user = await User.findById(tokenData._id).lean();

        //for cases when authToken is valid but user got deleted
        if (_.isEmpty(user)) {
          return handleResponse(res, {
            type: 'FORBIDDEN',
            message: 'User does not exist!',
          });
        }

        req.user = user;
        next();
      }
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

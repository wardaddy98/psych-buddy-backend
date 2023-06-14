import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User } from '../../models/user.model.js';
import { handleResponse } from '../../utils/handleResponse.js';
import { generateToken } from '../../utils/tokenUtils.js';

export const login = async (req, res) => {
  //login sends jwt which only contains userId
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email }, { __v: 0 }).lean();

    if (_.isEmpty(userData)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Email does not exist',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return handleResponse(res, {
        type: 'UNAUTHORIZED',
        message: 'Password is incorrect!',
      });
    }

    delete userData.password;

    const authToken = generateToken(
      { _id: userData._id },
      {
        expiresIn: '7d',
      },
    );

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Logged in successfully',
      body: { authToken, user: userData },
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

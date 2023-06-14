import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User } from '../../models/user.model.js';
import { handleResponse } from '../../utils/handleResponse.js';
import { generateToken } from '../../utils/tokenUtils.js';

export const register = async (req, res) => {
  //register sends jwt which only contains userId
  try {
    const payload = req.body;
    const { email, userName } = payload;

    const emailExists = await User.findOne({ email }).lean();

    if (!_.isEmpty(emailExists)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'An account with this email already exists',
      });
    }

    const userNameExists = await User.findOne({ userName }).lean();
    if (!_.isEmpty(userNameExists)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'An account with this user name already exists',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
    payload.password = hashedPassword;
    let user = await User.create(payload);
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    delete user.__v;

    // const authToken = jwt.sign(user, JWT_SECRET_KEY);
    const authToken = generateToken(
      { _id: user._id },
      {
        expiresIn: '1d',
      },
    );

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'User created successfully',
      body: {
        authToken,
        user,
      },
    });
  } catch (e) {
    console.log(e);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

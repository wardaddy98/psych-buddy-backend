import bcrypt from 'bcrypt';
import { User } from '../../models/user.model.js';
import { handleResponse } from '../../utils/handleResponse.js';

export const updateUserDetails = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const payload = req.body;

    const updatedUserData = await User.findOneAndUpdate(
      { _id: userId },
      { ...payload },
      { new: true },
    ).lean();
    delete updatedUserData.password;
    delete updatedUserData.__v;

    //send updated authToken and userData to client if user Data was updated
    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Details updated successfully',
      body: { user: updatedUserData },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(userId).lean();

    const isPasswordMatch = await bcrypt.compare(oldPassword, user?.password);

    if (!isPasswordMatch) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Password is incorrect',
      });
    }

    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne({ _id: userId }, { $set: { password: newHashedPassword } });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Password changed successfully!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId).lean();

    delete user.password;
    delete user.__v;

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Password changed successfully!',
      body: {
        user,
      },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

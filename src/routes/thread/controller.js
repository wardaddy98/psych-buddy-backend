import _ from 'lodash';
import { Category } from '../../models/category.model.js';
import { Thread } from '../../models/thread.model.js';
import { User } from '../../models/user.model.js';
import { handleResponse } from '../../utils/handleResponse.js';

export const getHomeThreads = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const threads = await Thread.find({ interactedBy: { $in: [userId] } })
      .populate({ path: 'postedBy', select: '_id firstName lastName userName' })
      .populate({ path: 'category', select: '-__v' })
      .lean();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Home threads loaded successfully',
      body: { threads },
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getExploreThreads = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const threads = await Thread.find({ postedBy: { $ne: userId } })
      .populate({ path: 'postedBy', select: '_id firstName lastName userName' })
      .populate({ path: 'category', select: '-__v' })
      .lean();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Home threads loaded successfully',
      body: { threads },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getMyThreads = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const threads = await Thread.find({ postedBy: userId })
      .populate({
        path: 'postedBy',
        select: '_id firstName lastName userName',
      })
      .populate({
        path: 'category',
        select: '-__v',
      })
      .lean();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'My Threads loaded successfully',
      body: { threads },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getSavedThreads = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId).select('-__v').lean();

    const threads = await Thread.find({ _id: { $in: user.savedThreads } })
      .populate({
        path: 'postedBy',
        select: '_id firstName lastName userName',
      })
      .populate({
        path: 'category',
        select: '-__v',
      })
      .lean();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'My Threads loaded successfully',
      body: { threads },
    });
  } catch (err) {
    console.log(err);
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const createThread = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const payload = req.body;

    if (payload?.otherCategory) {
      let category = await Category.create({ label: payload.otherCategory });
      category = JSON.parse(JSON.stringify(category));
      delete payload.otherCategory;
      payload.category = category._id;
    }

    await Thread.create({ ...payload, postedBy: userId });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Thread created successfully!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const saveThread = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId).lean();

    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread not found!',
      });
    }

    if (thread?.postedBy === userId) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'You cannot save your own created thread!',
      });
    }

    const user = await User.findById(userId).lean();

    if (user?.savedThreads?.includes(threadId)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread already saved',
      });
    }

    await User.updateOne({ _id: userId }, { $push: { savedThreads: threadId } });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Thread saved!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const unSaveThread = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId).lean();

    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread not found!',
      });
    }

    const user = await User.findById(userId).lean();

    if (!user?.savedThreads?.includes(threadId)) {
      return handleResponse(res, {
        type: 'ERROR',
        message: 'Cannot unsave a thread that is not saved',
      });
    }

    await User.updateOne({ _id: userId }, { $pull: { savedThreads: threadId } });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Thread Unsaved!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const deleteThread = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId).lean();
    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread does not exist!',
      });
    }

    if (thread?.postedBy !== userId) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'This thread was not created by you!',
      });
    }

    await Thread.deleteOne({ _id: threadId });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Thread deleted!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const getSingleThread = async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId)
      .select('-__v')
      .populate({
        path: 'postedBy',
        select: '_id userName firstName lastName',
      })
      .populate({
        path: 'category',
        select: '-__v',
      })
      .lean();

    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread does not exist',
      });
    }

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Thread loaded successfully',
      body: { thread },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const updateInteractionsCount = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { action } = req.body;

    const thread = await Thread.findById(threadId).lean();

    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread does not exist!',
      });
    }
    if (action === 'INCREMENT') {
      await Thread.updateOne({ _id: threadId }, { $inc: { interactionsCount: 1 } });
    } else {
      await Thread.updateOne({ _id: threadId }, { $inc: { interactionsCount: -1 } });
    }

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Interactions Count Updated!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const updateInteractedBy = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { _id: userId } = req.user;

    const thread = await Thread.findById(threadId).lean();

    if (_.isEmpty(thread)) {
      return handleResponse(res, {
        type: 'BAD_REQUEST',
        message: 'Thread does not exist!',
      });
    }

    if (thread?.interactedBy.includes(userId)) {
      return handleResponse(res, {
        type: 'SUCCESS',
        message: 'User already in record',
      });
    }

    await Thread.updateOne({ _id: threadId }, { $push: { interactedBy: userId } });

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Interactions Count Incremented!',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

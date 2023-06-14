import { Category } from '../../models/category.model.js';
import { handleResponse } from '../../utils/handleResponse.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $project: {
          __v: 0,
        },
      },
      {
        $addFields: {
          value: '$_id',
        },
      },
    ]).exec();

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Categories loaded successfully',
      body: { categories },
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    await Category.create(req.body);

    return handleResponse(res, {
      type: 'SUCCESS',
      message: 'Category created successfully',
    });
  } catch (err) {
    return handleResponse(res, {
      type: 'ERROR',
    });
  }
};

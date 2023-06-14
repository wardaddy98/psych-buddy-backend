import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const categorySchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  label: {
    type: String,
  },
});

export const Category = mongoose.model('categories', categorySchema);

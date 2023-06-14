import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const threadSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  postAnonymously: {
    type: Boolean,
  },
  postedBy: {
    type: String,
    ref: 'users',
  },
  category: {
    type: String,
    ref: 'categories',
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  interactionsCount: {
    type: Number,
    default: 0,
  },
  interactedBy: [
    {
      type: String,
      ref: 'users',
    },
  ],
});

export const Thread = mongoose.model('threads', threadSchema);

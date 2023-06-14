import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    lowercase: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    immutable: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['normal', 'professional'],
  },
  bio: {
    type: String,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
    immutable: true,
  },
  savedThreads: [
    {
      type: String,
      ref: 'threads',
    },
  ],
});

export const User = mongoose.model('users', userSchema);

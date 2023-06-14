import express from 'express';
import { isLoggedIn } from '../../middlewares/authMiddleware.js';
import {
  createThread,
  deleteThread,
  getExploreThreads,
  getHomeThreads,
  getMyThreads,
  getSavedThreads,
  getSingleThread,
  updateInteractionsCount,
  saveThread,
  unSaveThread,
  updateInteractedBy,
} from './controller.js';
const router = express.Router();

router.post('/', isLoggedIn, createThread);
router.get('/home', isLoggedIn, getHomeThreads);
router.get('/my', isLoggedIn, getMyThreads);
router.get('/explore', isLoggedIn, getExploreThreads);
router.get('/saved', isLoggedIn, getSavedThreads);
router.get('/:threadId', isLoggedIn, getSingleThread);
router.patch('/save/:threadId', isLoggedIn, saveThread);
router.patch('/unsave/:threadId', isLoggedIn, unSaveThread);
router.patch('/interactions/:threadId', isLoggedIn, updateInteractionsCount);
router.patch('/interacted-by/:threadId', isLoggedIn, updateInteractedBy);
router.delete('/:threadId', isLoggedIn, deleteThread);
export default router;

import express from 'express';
import { isLoggedIn } from '../../middlewares/authMiddleware.js';
import { changePassword, getUser, updateUserDetails } from './controller.js';
const router = express.Router();

router.get('/', isLoggedIn, getUser);
router.patch('/details', isLoggedIn, updateUserDetails);
router.patch('/change-password', isLoggedIn, changePassword);

export default router;

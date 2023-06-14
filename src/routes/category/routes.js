import express from 'express';
import { isLoggedIn } from '../../middlewares/authMiddleware.js';
import { createCategory, getCategories } from './controller.js';
const router = express.Router();

router.get('/', isLoggedIn, getCategories);
router.post('/', isLoggedIn, createCategory);

export default router;

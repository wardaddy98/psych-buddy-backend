import express from 'express';
import categoryRouter from './src/routes/category/routes.js';
import loginRouter from './src/routes/login/routes.js';
import registerRouter from './src/routes/register/routes.js';
import threadRouter from './src/routes/thread/routes.js';
import userRouter from './src/routes/user/routes.js';
const router = express.Router();

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/thread', threadRouter);

export default router;

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import mainRouter from './routes.js';
import { DB_URI, PORT } from './src/constants.js';

try {
  mongoose.connect(DB_URI).then(() => {
    console.log('Database connection established');
  });
} catch (err) {
  console.log(err);
}

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://psych-buddy.netlify.app'],
    methods: ['POST, PATCH', 'DELETE'],
  }),
);

app.use(express.json());

app.use('/', mainRouter);

app.listen(PORT || 3001, () => {
  console.log(`Server started on port ${PORT}`);
});

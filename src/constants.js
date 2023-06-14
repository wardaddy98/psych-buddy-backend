import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


import dotenv from 'dotenv';

dotenv.config();

export const envVariable={
PORT : process.env.PORT,
DB_URL: process.env.DB_URL,
ENV:process.env.ENV,
}


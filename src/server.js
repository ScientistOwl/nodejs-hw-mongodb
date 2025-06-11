import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

if (
  !process.env.MONGODB_USER ||
  !process.env.MONGODB_PASSWORD ||
  !process.env.MONGODB_URL ||
  !process.env.MONGODB_DB
) {
  console.error(
    'MONGODB environment variables are not fully defined! Check .env',
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './server.js';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB, PORT } =
  process.env;

const MONGO_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    app.listen(PORT || 3000, () => {
      console.log(`Server running on port ${PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

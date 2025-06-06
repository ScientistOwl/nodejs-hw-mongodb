import dotenv from 'dotenv';
dotenv.config();

import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

startApp();

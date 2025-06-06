import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactRoutes from './routes/contactRoutes.js';

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.use('/contacts', contactRoutes);

  app.use((req, res) => res.status(404).json({ message: 'Not found' }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

export default setupServer;

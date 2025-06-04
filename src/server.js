const express = require('express');
const cors = require('cors');
const contactsRoutes = require('./routes/contactRoutes');
const { initMongoConnection } = require('./db/initMongoConnection');
const pino = require('pino');
const dotenv = require('dotenv');

dotenv.config();
const logger = pino({ level: 'info' });

const setupServer = async () => {
  try {
    await initMongoConnection();

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/contacts', contactsRoutes);

    app.use((req, res) => {
      res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { setupServer };

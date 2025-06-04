const express = require('express');
const cors = require('cors');
const { initMongoConnection } = require('./db/initMongoConnection');
const contactRoutes = require('./routes/contactRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');

const setupServer = async () => {
  await initMongoConnection();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/contacts', contactRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(
      `Swagger API Docs available at http://localhost:${PORT}/api-docs`,
    );
  });
};

module.exports = { setupServer };

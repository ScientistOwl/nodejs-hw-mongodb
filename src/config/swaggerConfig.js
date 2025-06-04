const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

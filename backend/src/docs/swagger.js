const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Scalable REST API with Auth & RBAC',
    version: '1.0.0',
    description: 'API documentation for Firebase-authenticated task management service.'
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/v1/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;

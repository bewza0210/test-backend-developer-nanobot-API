const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const userValidator = require('../validators/userValidator');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nanobot API',
      version: '1.0.0',
      description: 'API documentation for Nanobot backend',
    },
    components: {
      schemas: {
        User: userValidator.user.swaggerSchema,
        ChangePassword: userValidator.changePassword.swaggerSchema,
        Auth: userValidator.login.swaggerSchema,
        Register:userValidator.user.swaggerSchema
      },
    },
    servers: [ { url: 'http://localhost:3000/api' },],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;

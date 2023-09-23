const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
});

function docsRoute(router) {
  router.use('/', swaggerUi.serve);
  router.get(
    '/',
    swaggerUi.setup(specs, {
      explorer: true,
    })
  );

  return router
}


module.exports = { docsRoute };

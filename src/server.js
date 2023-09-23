const config = require('./config/config')
const { RedisCache } = require('./cache');
const { ExpressRouter, createRouter } = require('./router');
const AppRoutes = require('./routes/v1');

const PORT = Number(config.port);
const HOST = config.host

const cache = new RedisCache(HOST, 1, 10);
const routes = new AppRoutes(createRouter, cache)

const httpRouter = new ExpressRouter('/v1', routes.router);

// httpRouter.get('/', (res, req) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello from server!');
//   res.end();
// });
httpRouter.serve(PORT);

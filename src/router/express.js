const express = require('express')
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('../config/config');
const morgan = require('../config/morgan');
const { jwtStrategy } = require('../config/passport');
const { authLimiter } = require('../middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('../middlewares/error');
const ApiError = require('../utils/ApiError');

class ExpressRouter {
  app
  router

  constructor(version='/v1', routes) {
    const app = express()

    if (config.env !== 'test') {
      app.use(morgan.successHandler);
      app.use(morgan.errorHandler);
    }

    // set security HTTP headers
    app.use(helmet());

    // parse json request body
    app.use(express.json());

    // parse urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // sanitize request data
    app.use(xss());
    app.use(mongoSanitize());

    // gzip compression
    app.use(compression());

    // enable cors
    app.use(cors());
    app.options('*', cors());

    // jwt authentication
    app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);

    // limit repeated failed requests to auth endpoints
    if (config.env === 'production') {
      app.use('/v1/auth', authLimiter);
    }

    // v1 api routes
    app.use(version, routes);

    // send back a 404 error for any unknown api request
    app.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });

    // convert error to ApiError, if needed
    app.use(errorConverter);

    // handle error
    app.use(errorHandler);

    this.app = app;
  }

  serve(port) {
    return this.app.listen(port, () => {
      console.log(`Express app listening on port ${port}`)
    })
  }
}

class ChildRoute {
  router
  constructor(router) {
    this.router = router
  }

  get(endpoint, ...handler) {
    return this.router.route(endpoint).get(...handler)
  }

  post(endpoint, ...handler) {
    return this.router.post(endpoint, ...handler)
  }

  put(endpoint, ...handler) {
    return this.router.put(endpoint, ...handler)
  }

  patch(endpoint, ...handler) {
    return this.router.patch(endpoint, ...handler)
  }

  delete(endpoint, ...handler) {
    return this.router.delete(endpoint, ...handler)
  }

  response(res, status, payload) {
    return res.status(status).send(payload)
  }
}

module.exports = {
  ExpressRouter,
  ChildRoute,
  createRouter: express.Router
}
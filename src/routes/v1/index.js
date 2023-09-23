const express = require('express')
const { authRoute } = require('./auth.route');
const { userRoute } = require('./user.route');
const { postRoute } = require('./post.route');
const { docsRoute } = require('./docs.route');
const config = require('../../config/config');

class AppRoutes {
  router

  constructor(createRouter, cache) {
    this.router = createRouter()
    
    const defaultRoutes = [
      {
        path: '/auth',
        route: authRoute(createRouter()),
      },
      {
        path: '/users',
        route: userRoute(createRouter(), cache),
      },
      {
        path: '/post',
        route: postRoute(createRouter(), cache)
      }
    ];
    
    const devRoutes = [
      // routes available only in development mode
      // {
      //   path: '/docs',
      //   route: docsRoute(router, cache)
      // },
    ];
    
    defaultRoutes.forEach((route) => {
      this.router.use(route.path, route.route);
    });

    if (config.env === 'development') {
      devRoutes.forEach((route) => {
        this.router.use(route.path, route.route);
      });
    }
  }
}

module.exports = AppRoutes;

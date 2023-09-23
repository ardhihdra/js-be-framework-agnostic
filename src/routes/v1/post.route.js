const express = require('express')
const { PostgresRepository, FirestoreRepository } = require('../../repository');
const { PostService } = require('../../services');
const { PostController } = require('../../controllers');
const { ChildRoute } = require('../../router/express');
const auth = require('../../middlewares/auth');

const postRepo = new PostgresRepository('invitations');
// const postRepo = new FirestoreRepository('invitations');
const postService = new PostService(postRepo);

function postRoute(router, cache) {
  const routing = new ChildRoute(router)
  const postController = new PostController(postService, cache, routing);
  routing.get('/', [], postController.getPosts.bind(postController));
  // router.get('/posts', postController.controlGetAll);
  routing.get('/:id', [], postController.getPostByID.bind(postController));
  routing.post('/', auth(), [], postController.createPost.bind(postController));

  return routing.router
}

// httpRouter.get('/', (res, req) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello from server!');
//   res.end();
// });
module.exports = { postRoute }

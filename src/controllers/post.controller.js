const { ServiceError } = require('../utils/ServiceError');

class PostController {
  postCache;
  postService;
  postRouter;

  constructor(postService, postCache, postRouter) {
    this.postService = postService;
    this.postCache = postCache;
    this.postRouter = postRouter;
  }

  async getPosts(req, res) {
    try {
      const posts = await this.postService.findAll();
      return this.postRouter.response(res, 200, posts);
    } catch (err) {
      console.error(err)
      return this.postRouter.response(res, 500, new ServiceError('Error getting posts'));
      // res.status(500).json(new ServiceError('Error getting posts'));
    }
  }

  async getPostByID(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const postID = req.params.id;
    // const cachedPost = await this.postCache.get(postID);
    // if (cachedPost !== undefined) {
    //   return this.postRouter.response(res, 200, cachedPost);
    //   // res.status(200).json(cachedPost);
    // }
    const post = await this.postService.findByID(postID);
    if (post === undefined) {
      return this.postRouter.response(res, 404, new ServiceError('No posts found'));
    } else {
      // try {
      //   this.postCache.set(postID, post);
      // } catch (err) {
      //   console.error("error setting post redis")
      //   // return this.postRouter.response(res, 500, new ServiceError('Error getting post'));
      //   // res.status(500).json(new ServiceError('Error getting post'));
      // }
      return this.postRouter.response(res, 200, post);
    }
  }

  async createPost(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const post = req.body;
    if (!post) {
      return this.postRouter.response(res, 400, new ServiceError('Post is required'));
    }
    try {
      if (await this.postService.validate(post)) {
        const result = await this.postService.create(post);
        return this.postRouter.response(res, 201, result);
      } else {
        return this.postRouter.response(res, 400, new ServiceError('Post is invalid'));
      }
    } catch (err) {
        return this.postRouter.response(res, 500, new ServiceError('Error adding post'));
        // res.status(500).json(new ServiceError('Error adding post'));
    }
  }

  async updatePost(req, res) {

  }

  async deletePost(req, res) {
    
  }
}

module.exports = {
  PostController
}
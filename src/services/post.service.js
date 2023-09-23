
class PostService {
  repo;
  constructor(repository) {
    this.repo = repository;
  }
  validate(post) {
    if (post == null) {
      const err = new Error("post cannot be empty");
      return err;
    }
    if (post.title == "") {
      const err = new Error("post title cannot be empty");
      return err;
    }
    return null;
  }
  create(post) {
    post.id = Math.floor(Math.random() * 10000);
    return this.repo.Save(post);
  }
  findAll() {
    return this.repo.findAll();
  }
  findByID(id) {
    return this.repo.findByID(id);
  }
}

module.exports = PostService

const UserModel = require('./models/user.model');
const InvitationModel = require('./models/invitation.model');
const { RepositoryInterface } = require('../interface');

const nameToModelMap = {
  'users': UserModel,
  'invitations': InvitationModel
}

class PostgresRepository extends RepositoryInterface {
  constructor(tableName) {
    super();
    this.tableName = tableName;

    this.model = nameToModelMap[tableName]
  }

  async create(post) {
    const createdPost = await this.model.create(post);
    return createdPost.toJSON();
  }

  async findOne(filter) {
    return this.findAll(filter)[0];
  }

  async findAll(filter = {}) {
    const posts = await this.model.findAll({ where: filter });
    return posts;
  }

  async findByID(id) {
    const post = await this.model.findByPk(id);
    if (post) {
      return post;
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

  async findByField(field, value) {
    const post = await this.model.findOne({ where: { [field]: value } });
    if (post) {
      return post.toJSON();
    } else {
      return undefined;
    }
  }
}

module.exports = {
  PostgresRepository
}

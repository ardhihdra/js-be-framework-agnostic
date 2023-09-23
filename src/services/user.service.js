const httpStatus = require('http-status');
const { User } = require('../repository/mongoose/models');
const ApiError = require('../utils/ApiError');


class UserService {
  repo;
  constructor(repository) {
    this.repo = repository;
  }

  isEmailTaken = async function (email, excludeUserId) {
    const user = await this.repo.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };
  
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  createUser = async (userBody) => {
    if (await isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return this.repo.create(userBody);
  };
  
  /**
   * Query for users
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  queryUsers = async (filter, options) => {
    const users = await this.repo.paginate(filter, options);
    return users;
  };
  
  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  getUserById = async (id) => {
    return this.repo.findById(id);
  };
  
  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  getUserByEmail = async (email) => {
    return this.repo.findOne({ email });
  };
  
  /**
   * Update user by id
   * @param {ObjectId} userId
   * @param {Object} updateBody
   * @returns {Promise<User>}
   */
  updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };
  
  /**
   * Delete user by id
   * @param {ObjectId} userId
   * @returns {Promise<User>}
   */
  deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
  };
}

module.exports = UserService;


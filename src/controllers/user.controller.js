const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

class UserController {
  userCache;
  userService;
  userRouter;

  constructor(userService, userCache, userRouter) {
    this.userService = userService;
    this.userCache = userCache;
    this.userRouter = userRouter;
  }

  createUser = catchAsync(async (req, res) => {
    const user = await this.userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  });
  
  getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await this.userService.queryUsers(filter, options);
    res.send(result);
  });
  
  getOneUser = catchAsync(async (req, res) => {
    const user = await this.userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  });
  
  updateUser = catchAsync(async (req, res) => {
    const user = await this.userService.updateUserById(req.params.userId, req.body);
    res.send(user);
  });

  deleteUser = catchAsync(async (req, res) => {
    await this.userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  });
}


module.exports = {
  UserController,
};

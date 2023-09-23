const httpStatus = require('http-status');
const tokenService = require('./token.service');
const UserService = require('./user.service');
const Token = require('../repository/mongoose/models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

class AuthService {
  repo;
  constructor(repository) {
    this.repo = repository;
    this.userService = new UserService(this.repo)
  }

  /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  loginUserWithEmailAndPassword = async (email, password) => {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  };
  
  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.remove();
  };
  
  /**
   * Refresh auth tokens
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  refreshAuth = async (refreshToken) => {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await this.userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  };
  
  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
      const user = await this.userService.getUserById(resetPasswordTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await this.userService.updateUserById(user.id, { password: newPassword });
      await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
  };
  
  /**
   * Verify email
   * @param {string} verifyEmailToken
   * @returns {Promise}
   */
  verifyEmail = async (verifyEmailToken) => {
    try {
      const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
      const user = await this.userService.getUserById(verifyEmailTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
      await this.userService.updateUserById(user.id, { isEmailVerified: true });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
  };
}


module.exports = {
  AuthService
};

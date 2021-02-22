const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
} = require('./account.dal');
const { createBlackListToken } = require('../black-list-token/black-list-token.dal');
const { sendGreetingEmail } = require('../../utils/node-mailer');
const { sendResponse } = require('../../utils/helper');

const comparePassword = async (pass1, pass2) => bcrypt.compare(pass1, pass2);

const generateAccessToken = (userId, userEmail) => jwt.sign({ userId, userEmail }, 'random string', { expiresIn: '30d' });

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const signup = async (req, res, next) => {
  try {
    const user = await createUser(req.body.email, req.body.password);
    sendGreetingEmail(user.email);
    return sendResponse(res, 201, 'Signed up successfully.');
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return sendResponse(res, 422, 'Email already taken.');
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      return sendResponse(res, 404, 'Email was not found.');
    }

    const validUser = await comparePassword(req.body.password, user.password);
    if (!validUser) {
      return sendResponse(res, 401, 'Incorrect password.');
    }

    const token = generateAccessToken(user._id, user.email);
    res.cookie('access_token', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return sendResponse(res, 200, 'Logged in successfully.');
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await findUserById(userId);

    const validUser = await comparePassword(req.body.oldPassword, user.password);
    if (!validUser) {
      return sendResponse(res, 401, 'Old password should be correct.');
    }

    const hashedPassword = await generateHashedPassword(req.body.newPassword);
    await updateUserPasswordById(userId, hashedPassword);
    return sendResponse(res, 200, 'You changed password successfully.');
  } catch (err) {
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await createBlackListToken(req.headers.authorization);
    res.clearCookie('access_token');
    return sendResponse(res, 200, 'You logged out successfully.');
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  logout,
};

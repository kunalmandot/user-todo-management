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
    return res.status(201).json({ msg: 'Signed up successfully.' });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(422).json({ msg: 'Email already taken.' });
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ msg: 'Email was not found.' });
    }

    const validUser = await comparePassword(req.body.password, user.password);
    if (!validUser) {
      return res.status(401).json({ msg: 'Incorrect password.' });
    }

    const token = generateAccessToken(user._id, user.email);
    res.cookie('access_token', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.json({ msg: 'Logged in successfully.' });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await findUserById(userId);

    const validUser = await comparePassword(req.body.oldPassword, user.password);
    if (!validUser) {
      return res.status(401).json({ msg: 'Old password should be correct.' });
    }

    const hashedPassword = await generateHashedPassword(req.body.newPassword);
    await updateUserPasswordById(userId, hashedPassword);
    return res.json({ msg: 'You changed password successfully.' });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    return next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await createBlackListToken(req.headers.authorization);
    res.clearCookie('access_token');
    return res.json({ msg: 'You logged out successfully.' });
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

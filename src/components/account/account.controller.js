const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { signupSchema, loginSchema, changePasswordSchema } = require('./account.validation');
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPasswordById,
} = require('./account.dal');
const { createBlackListToken } = require('../black-list-token/black-list-token.dal');
const { sendGreetingEmail } = require('../../utils/node-mailer');

const comparePassword = async (pass1, pass2) => bcrypt.compare(pass1, pass2);

const generateAccessToken = (userId) => jwt.sign({ userId }, 'random string', { expiresIn: '30d' });

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const signup = async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);

    const user = await createUser(result.email, result.password);
    if (user) {
      sendGreetingEmail(user.email);
      return res.status(201).json({ msg: 'Signed up successfully.' });
    }
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(422).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ msg: 'Email already taken.' });
    }
    return next();
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    const user = await findUserByEmail(result.email);
    if (!user) {
      return res.status(400).json({ msg: 'Email is not valid.' });
    }

    const validUser = await comparePassword(result.password, user.password);
    if (!validUser) {
      return res.status(400).json({ msg: 'Incorrect password.' });
    }

    const token = generateAccessToken(user._id);
    res.cookie('access_token', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json({ msg: 'Logged in successfully.' });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(422).json({ msg: err.message });
    }
    return next();
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordSchema.validateAsync(req.body);

    const { userId } = req.user;

    const user = await findUserById(userId);
    if (user) {
      const validUser = await comparePassword(result.oldPassword, user.password);
      if (!validUser) {
        return res.status(400).json({ msg: 'Old password should be correct.' });
      }
      const hashedPassword = await generateHashedPassword(result.newPassword);
      await updateUserPasswordById(userId, hashedPassword);
      return res.json({ msg: 'You changed password successfully.' });
    }
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(422).json({ msg: err.message });
    }
    return next();
  }
};

const logout = async (req, res, next) => {
  try {
    const blackListToken = await createBlackListToken(req.cookies.access_token);
    if (blackListToken) {
      res.clearCookie('access_token');
      return res.json({ msg: 'You logged out successfully.' });
    }
    return next();
  } catch (err) {
    return next();
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  logout,
};

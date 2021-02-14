const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');

const { signupSchema, loginSchema } = require('./account.validation');
const { createUser, findByEmail } = require('./account.dal');
const { createBlackListToken } = require('../black-list-token/black-list-token.dal');

const generateAccessToken = (userId) => jwt.sign({ userId }, 'random string', { expiresIn: '30d' });

const transporter = nodeMailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: 'user.todo.management@gmail.com',
    pass: 'user-todo-management',
  },
  secure: true,
});

const signup = async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);

    const user = await createUser(result.email, result.password);
    if (user) {
      const mailData = {
        from: 'user.todo.management@gmail.com',
        to: user.email,
        subject: 'Greeting from user todo management',
        text: 'Welcome to the user todo management',
      };

      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

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

    const user = await findByEmail(result.email);
    if (!user) {
      return res.status(400).json({ msg: 'Email is not valid.' });
    }

    const validUser = await bcrypt.compare(result.password, user.password);
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
  logout,
};

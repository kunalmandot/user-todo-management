const jwt = require('jsonwebtoken');
const { findTokenByToken } = require('../components/black-list-token/black-list-token.dal');

// eslint-disable-next-line consistent-return
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ msg: 'There was not any token.' });
  }
  try {
    const blackListToken = await findTokenByToken(token);
    if (blackListToken) {
      return res.status(400).json({ msg: 'Your token is already destroyed.' });
    }
    jwt.verify(token, 'random string', (err, user) => {
      if (err) {
        return res.status(401).json({ msg: 'Token mismatch occurred.' });
      }
      req.user = user;
      return next();
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticateToken;

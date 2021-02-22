const jwt = require('jsonwebtoken');
const { findTokenByToken } = require('../components/black-list-token/black-list-token.dal');
const { sendResponse } = require('../utils/helper');

// eslint-disable-next-line consistent-return
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendResponse(res, 400, 'There was not any token.');
  }
  try {
    const blackListToken = await findTokenByToken(token);
    if (blackListToken) {
      return sendResponse(res, 400, 'Your token is already destroyed.');
    }
    jwt.verify(token, 'random string', (err, user) => {
      if (err) {
        return sendResponse(res, 401, 'Token mismatch occurred.');
      }
      req.user = user;
      return next();
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = authenticateToken;

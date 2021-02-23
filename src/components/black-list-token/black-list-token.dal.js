const BlackListToken = require('./black-list-token.model');

const createBlackListToken = async (token) => {
  const blackListToken = new BlackListToken({
    token,
  });
  const blackListedToken = blackListToken.save();
  return blackListedToken;
};

const findTokenByToken = async (token) => BlackListToken.findOne({ token });

const getAllBlackListedToken = async () => BlackListToken.find({});

const deleteExpiredToken = async (expiredTokens) => BlackListToken.deleteMany({ token: { $in: expiredTokens } });

module.exports = {
  createBlackListToken,
  findTokenByToken,
  getAllBlackListedToken,
  deleteExpiredToken,
};

const BlackListToken = require('./black-list-token.model');

const createBlackListToken = async (token) => {
  const blackListToken = new BlackListToken({
    token,
  });
  const blackListedToken = blackListToken.save();
  return blackListedToken;
};

const findTokenByToken = async (token) => BlackListToken.findOne({ token });

module.exports = {
  createBlackListToken,
  findTokenByToken,
};

const BlackListToken = require('./black-list-token.model');

const createBlackListToken = async (token) => {
  const blackListToken = new BlackListToken({
    token,
  });
  return blackListToken.save();
};

const findTokenByToken = async (token) => BlackListToken.findOne({ token });

module.exports = {
  createBlackListToken,
  findTokenByToken,
};

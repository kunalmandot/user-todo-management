const BlackListToken = require('./black-list-token.model');

const createBlackListToken = async (token) => {
  const blackListToken = new BlackListToken({
    token,
  });
  return blackListToken.save();
};

module.exports = {
  createBlackListToken,
};

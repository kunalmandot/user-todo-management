const cron = require('node-cron');
const jwt = require('jsonwebtoken');

const { getAllBlackListedToken, deleteExpiredToken } = require('../components/black-list-token/black-list-token.dal');

const schedular = () => {
  cron.schedule('*/10 * * * * *', async () => {
    try {
      const expiredTokens = [];
      const blackListedToken = await getAllBlackListedToken();
      // eslint-disable-next-line no-restricted-syntax
      for (const value of Object.values(blackListedToken)) {
        jwt.verify(value.token, 'random string', (err) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              expiredTokens.push(value.token);
            }
          }
        });
      }
      await deleteExpiredToken(expiredTokens);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = schedular;

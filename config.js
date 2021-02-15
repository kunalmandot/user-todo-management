const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  mailUserName: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
};

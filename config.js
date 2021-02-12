const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
};

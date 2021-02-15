const express = require('express');

const {
  signup,
  login,
  changePassword,
  logout,
} = require('../components/account/account.controller');
const authenticateToken = require('../middlewares/authenticate-token');

const router = express.Router();

router.route('/signup')
  .post(signup);

router.route('/login')
  .post(login);

router.route('/change-password')
  .put(authenticateToken, changePassword);

router.route('/logout')
  .delete(authenticateToken, logout);

module.exports = router;

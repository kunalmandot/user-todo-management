const express = require('express');

const { signup, login, logout } = require('../components/account/account.controller');
const authenticateToken = require('../middlewares/authenticate-token');

const router = express.Router();

router.route('/signup')
  .post(signup);

router.route('/login')
  .post(login);

router.route('/change-password')
  .put();

router.route('/logout')
  .delete(authenticateToken, logout);

router.route('/block')
  .put();

router.route('/unblock')
  .put();

module.exports = router;

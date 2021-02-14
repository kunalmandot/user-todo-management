const express = require('express');

const { signup, login, logout } = require('../components/account/account.controller');

const router = express.Router();

router.route('/signup')
  .post(signup);

router.route('/login')
  .post(login);

router.route('/change-password')
  .put();

router.route('/logout')
  .delete(logout);

router.route('/block')
  .put();

router.route('/unblock')
  .put();

module.exports = router;

const express = require('express');

const { signup } = require('../components/account/account.controller');

const router = express.Router();

router.route('/signup')
  .post(signup);

router.route('/login')
  .post();

router.route('/change-password')
  .put();

router.route('/logout')
  .delete();

router.route('/block')
  .put();

router.route('/unblock')
  .put();

module.exports = router;

const express = require('express');

const {
  signup,
  login,
  changePassword,
  logout,
} = require('../components/account/account.controller');
const authenticateToken = require('../middlewares/authenticate-token');
const { signupValidation, loginValidation, changePasswordValidation } = require('../components/account/account.middleware');

const router = express.Router();

router.route('/signup')
  .post(signupValidation, signup);

router.route('/login')
  .post(loginValidation, login);

router.route('/change-password')
  .put(authenticateToken, changePasswordValidation, changePassword);

router.route('/logout')
  .delete(authenticateToken, logout);

module.exports = router;

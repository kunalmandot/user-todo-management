const { signupSchema, loginSchema, changePasswordSchema } = require('./account.validation');
const { sendResponse } = require('../../utils/helper');

const signupValidation = async (req, res, next) => {
  try {
    await signupSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

const loginValidation = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

const changePasswordValidation = async (req, res, next) => {
  try {
    await changePasswordSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

module.exports = {
  signupValidation,
  loginValidation,
  changePasswordValidation,
};

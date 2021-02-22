const { signupSchema, loginSchema, changePasswordSchema } = require('./account.validation');

const signupValidation = async (req, res, next) => {
  try {
    await signupSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
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
      return res.status(400).json({ msg: err.message });
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
      return res.status(400).json({ msg: err.message });
    }
    return next(err);
  }
};

module.exports = {
  signupValidation,
  loginValidation,
  changePasswordValidation,
};

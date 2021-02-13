const Joi = require('joi');

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
  confirmPassword: Joi.ref('password'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(16).required(),
  newPassword: Joi.string().min(8).max(16).required(),
  confirmNewPassword: Joi.ref('newPassword'),
});

module.exports = {
  signupSchema,
  loginSchema,
  changePasswordSchema,
};

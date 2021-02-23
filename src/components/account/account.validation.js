const Joi = require('joi');

const commonSchema = {
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email should be a type of string.',
      'string.email': 'Email should be a valid email.',
      'any.required': 'Email should be present.',
    }),
  password: Joi.string()
    .min(8)
    .max(16)
    .required()
    .messages({
      'string.base': 'Password should be a type of string.',
      'string.min': 'Password should contain at least 8 characters.',
      'string.max': 'Password should contain at most 16 characters.',
      'any.required': 'Password should be present.',
    }),
};

const signupSchema = Joi.object({
  email: commonSchema.email,
  password: commonSchema.password,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': 'Confirm password should be present.',
      'any.only': 'Password and confirm password should be same.',
    }),
});

const loginSchema = Joi.object({
  email: commonSchema.email,
  password: commonSchema.password,
});

const changePasswordSchema = Joi.object({
  oldPassword: commonSchema.password,
  newPassword: commonSchema.password,
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.required': 'Confirm new password should be present.',
      'any.only': 'New password and confirm new password should be same.',
    }),
});

module.exports = {
  signupSchema,
  loginSchema,
  changePasswordSchema,
};

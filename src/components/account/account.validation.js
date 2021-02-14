const Joi = require('joi');

const signupSchema = Joi.object({
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
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': 'Confirm password should be present.',
      'any.only': 'Password and confirm password should be same.',
    }),
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

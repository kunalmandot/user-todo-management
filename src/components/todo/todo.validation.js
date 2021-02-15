const Joi = require('joi');

const createOrUpdateTodoSchema = Joi.object({
  title: Joi.string()
    .required()
    .messages({
      'string.base': 'Title should be a type of string.',
      'any.required': 'Title should be present.',
    }),
  labelText: Joi.string()
    .required()
    .messages({
      'string.base': 'Label should be a type of string.',
      'any.required': 'Label should be present.',
    }),
  labelColour: Joi.string()
    .required()
    .messages({
      'string.base': 'Label colour should be a type of string.',
      'any.required': 'Label colour should be present.',
    }),
});

const shareOrUnshareTodoSchema = Joi.object({
  email: Joi.string().email().required(),
});

const createOrUpdateTaskSchema = Joi.object({
  text: Joi.string().required(),
});

module.exports = {
  createOrUpdateTodoSchema,
  shareOrUnshareTodoSchema,
  createOrUpdateTaskSchema,
};

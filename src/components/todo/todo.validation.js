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

const shareTodoSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email should be a type of string.',
      'string.email': 'Email should be a valid email.',
      'any.required': 'Email should be present.',
    }),
});

const createOrUpdateTaskSchema = Joi.object({
  taskText: Joi.string()
    .required()
    .messages({
      'string.base': 'Task should be a type of string.',
      'any.required': 'Task should be present.',
    }),
});

module.exports = {
  createOrUpdateTodoSchema,
  shareTodoSchema,
  createOrUpdateTaskSchema,
};

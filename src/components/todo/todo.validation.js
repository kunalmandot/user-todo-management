const Joi = require('joi');

const createOrUpdateTodoSchema = Joi.object({
  title: Joi.string().required(),
  labelText: Joi.string().required(),
  labelColour: Joi.string().required(),
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

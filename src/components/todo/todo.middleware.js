const { createOrUpdateTodoSchema, createOrUpdateTaskSchema, shareTodoSchema } = require('./todo.validation');

const createOrUpdateTodoValidation = async (req, res, next) => {
  try {
    await createOrUpdateTodoSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

const shareTodoValidation = async (req, res, next) => {
  try {
    await shareTodoSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

const createOrUpdateTaskValidation = async (req, res, next) => {
  try {
    await createOrUpdateTaskSchema.validateAsync(req.body);
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return sendResponse(res, 400, err.message);
    }
    return next(err);
  }
};

module.exports = {
  createOrUpdateTodoValidation,
  shareTodoValidation,
  createOrUpdateTaskValidation,
};

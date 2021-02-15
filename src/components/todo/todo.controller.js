const {
  findTodosByCreateBy,
  createTodo,
  findTodoById,
  updateTodoById,
  deleteTodoById,
} = require('./todo.dal');
const { createOrUpdateTodoSchema } = require('./todo.validation');

const throwResourceNotFoundError = (res, id) => res.status(404).json({ msg: `The TODO item with id ${id} was not found.` });

const throwUnauthorizedError = (res) => res.status(401).json({ msg: 'You are not authorized to access.' });

const getTodos = async (req, res, next) => {
  try {
    const todos = await findTodosByCreateBy(req.user.userId);
    if (todos.length === 0) {
      return res.json({ msg: 'You do not have any todos.' });
    }
    return res.json(todos);
  } catch (err) {
    return next();
  }
};

const postTodo = async (req, res, next) => {
  try {
    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const todo = await createTodo(req.user.userId, result.title, result.labelText, result.labelColour);
    if (todo) {
      return res.json({ msg: 'Created successfully.' });
    }
    return next();
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(422).json({ msg: 'Todo title already taken.' });
    }
    return next();
  }
};

const getTodo = async (req, res, next) => {
  const { todoId } = req.params;
  if (todoId.length !== 24) {
    return throwResourceNotFoundError(res, todoId);
  }
  try {
    const todo = await findTodoById(todoId);
    if (todo === null) {
      return throwResourceNotFoundError(res, todoId);
    }
    if (String(todo.createdBy) !== req.user.userId) {
      return throwUnauthorizedError(res);
    }
    return res.json(todo);
  } catch (err) {
    return next();
  }
};

const putTodo = async (req, res, next) => {
  const { userId } = req.user;
  const { todoId } = req.params;
  if (todoId.length !== 24) {
    return throwResourceNotFoundError(res, todoId);
  }
  try {
    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const todo = await findTodoById(todoId);
    if (todo === null) {
      return throwResourceNotFoundError(res, todoId);
    }
    if (String(todo.createdBy) !== userId) {
      return throwUnauthorizedError(res);
    }
    const updatedTodo = await updateTodoById(todoId, result.title, result.labelText, result.labelColour);
    return res.json({ msg: 'Updated successfully.', todo: updatedTodo });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(422).json({ msg: 'Todo title already taken.' });
    }
    return next();
  }
};

const deleteTodo = async (req, res, next) => {
  const { todoId } = req.params;
  if (todoId.length !== 24) {
    return throwResourceNotFoundError(res, todoId);
  }
  try {
    const todo = await findTodoById(todoId);
    if (todo === null) {
      return throwResourceNotFoundError(res, todoId);
    }
    if (String(todo.createdBy) !== req.user.userId) {
      return throwUnauthorizedError(res);
    }
    await deleteTodoById(todoId);
    return res.json({ msg: 'Deleted successfully.', todo });
  } catch (err) {
    return next();
  }
};

module.exports = {
  getTodos,
  postTodo,
  getTodo,
  putTodo,
  deleteTodo,
};

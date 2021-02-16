const {
  findTodosByCreateBy,
  createTodo,
  findTodoById,
  updateTodoById,
  deleteTodoById,
  addTaskToTodoByTodoId,
} = require('./todo.dal');
const { createOrUpdateTodoSchema, createOrUpdateTaskSchema } = require('./todo.validation');

const throwResourceNotFoundError = (res, id) => res.status(404).json({ msg: `The TODO item with id ${id} was not found.` });

const validateTodo = async (userId, todoId, res) => {
  if (todoId.length !== 24) {
    return throwResourceNotFoundError(res, todoId);
  }
  const todo = await findTodoById(todoId);
  if (todo === null) {
    return throwResourceNotFoundError(res, todoId);
  }
  if (String(todo.createdBy) !== userId) {
    return res.status(401).json({ msg: 'You are not authorized to access.' });
  }
  return todo;
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await findTodosByCreateBy(req.user.userId);
    if (todos.length === 0) {
      return res.json({ msg: 'You do not have any todos.' });
    }
    return res.json(todos);
  } catch (err) {
    return next(err);
  }
};

const postTodo = async (req, res, next) => {
  try {
    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const todo = await createTodo(req.user.userId, result.title, result.labelText, result.labelColour);
    return res.json({ msg: 'Created successfully.', todo });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(422).json({ msg: 'Todo title already taken.' });
    }
    return next(err);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const todo = await validateTodo(req.user.userId, req.params.todoId, res);
    return res.json(todo);
  } catch (err) {
    return next(err);
  }
};

const putTodo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    await validateTodo(userId, todoId, res);

    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const updatedTodo = await updateTodoById(userId, todoId, result.title, result.labelText, result.labelColour);
    return res.json({ msg: 'Updated successfully.', todo: updatedTodo });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(422).json({ msg: 'Todo title already taken.' });
    }
    return next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { todoId } = req.params;

    const todo = await validateTodo(req.user.userId, todoId, res);

    await deleteTodoById(todoId);
    return res.json({ msg: 'Deleted successfully.', todo });
  } catch (err) {
    return next();
  }
};

const postTask = async (req, res, next) => {
  try {
    const { todoId } = req.params;

    const todo = await validateTodo(req.user.userId, todoId, res);

    const result = await createOrUpdateTaskSchema.validateAsync(req.body);

    if (typeof todo.tasks === 'object') {
      const taskExist = todo.tasks.find((task) => task.text === result.taskText);
      if (taskExist) {
        return res.status(422).json({ msg: 'Task already taken.' });
      }
    }
    const todoWithTask = await addTaskToTodoByTodoId(todoId, result.taskText);
    return res.json({ msg: 'Task created successfully.', todo: todoWithTask });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    return next(err);
  }
};

module.exports = {
  getTodos,
  postTodo,
  getTodo,
  putTodo,
  deleteTodo,
  postTask,
};

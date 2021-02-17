const {
  findTodosByCreateBy,
  findTrashedTodosByCreateBy,
  createTodo,
  findTodoById,
  findTrashedTodoById,
  updateTodoById,
  updateTodoStatusById,
  deleteTodoById,
  addTaskToTodoByTodoId,
  updateTaskTextByTodoIdAndTaskId,
  updateTaskStatusByTodoIdAndTaskId,
  deleteTaskByTodoIdAndTaskId,
} = require('./todo.dal');
const { createOrUpdateTodoSchema, createOrUpdateTaskSchema } = require('./todo.validation');

const throwResourceNotFoundError = (res, id) => res.status(404).json({ msg: `The item with id ${id} was not found.` });

const validateTodo = async (userId, todoId) => {
  if (todoId.length !== 24) {
    return false;
  }
  const todo = await findTodoById(todoId);
  if (todo === null) {
    return false;
  }
  if (String(todo.createdBy) !== userId) {
    return false;
  }
  return todo;
};

const validateTask = (tasks, taskId) => {
  if (taskId.length !== 24) {
    return false;
  }
  if (typeof tasks === 'object') {
    const taskExist = tasks.find((task) => String(task._id) === taskId);
    if (taskExist) {
      return taskExist;
    }
    return false;
  }
  return false;
};

const taskTextExistence = (tasks, taskText, taskId) => {
  if (typeof tasks === 'object') {
    const taskExist = tasks.find((task) => task.text === taskText);
    if (taskExist) {
      if (String(taskExist._id) !== taskId) {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
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

const getTrashedTodos = async (req, res, next) => {
  try {
    const trashedTodos = await findTrashedTodosByCreateBy(req.user.userId);
    if (trashedTodos.length === 0) {
      return res.json({ msg: 'You do not have any trashed todos.' });
    }
    return res.json(trashedTodos);
  } catch (err) {
    return next(err);
  }
};

const postTodo = async (req, res, next) => {
  try {
    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const todo = await createTodo(req.user.userId, result.title, result.labelText, result.labelColour);
    return res.json({ msg: 'Todo created successfully.', todo });
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
    const { todoId } = req.params;
    const todo = await validateTodo(req.user.userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }
    return res.json(todo);
  } catch (err) {
    return next(err);
  }
};

const putTodo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    if (await validateTodo(userId, todoId) === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    const result = await createOrUpdateTodoSchema.validateAsync(req.body);

    const updatedTodo = await updateTodoById(userId, todoId, result.title, result.labelText, result.labelColour);
    return res.json({ msg: 'Todo updated successfully.', todo: updatedTodo });
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

    const todo = await validateTodo(req.user.userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    await deleteTodoById(todoId);
    return res.json({ msg: 'Todo deleted successfully.', todo });
  } catch (err) {
    return next(err);
  }
};

const putTodoToTrash = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    if (await validateTodo(userId, todoId) === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    const trashedTodo = await updateTodoStatusById(todoId, userId, false);
    return res.json({ msg: 'Todo was moved to trash successfully.', todo: trashedTodo });
  } catch (err) {
    return next(err);
  }
};

const putRestoreTodo = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    if (todoId.length !== 24) {
      return throwResourceNotFoundError(res, todoId);
    }
    const todo = await findTrashedTodoById(todoId);
    if (todo === null) {
      return throwResourceNotFoundError(res, todoId);
    }
    if (String(todo.createdBy) !== userId) {
      return throwResourceNotFoundError(res, todoId);
    }

    const restoredTodo = await updateTodoStatusById(todoId, userId, true);
    return res.json({ msg: 'Todo was restored successfully.', todo: restoredTodo });
  } catch (err) {
    return next(err);
  }
};

const postTask = async (req, res, next) => {
  try {
    const { todoId } = req.params;

    const todo = await validateTodo(req.user.userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    const result = await createOrUpdateTaskSchema.validateAsync(req.body);

    if (taskTextExistence(todo.tasks, result.taskText, null) === true) {
      return res.status(422).json({ msg: 'Task already taken.' });
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

const putTask = async (req, res, next) => {
  try {
    const { todoId, taskId } = req.params;
    const { userId } = req.user;

    const todo = await validateTodo(userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    const result = await createOrUpdateTaskSchema.validateAsync(req.body);

    if (validateTask(todo.tasks, taskId) === false) {
      return throwResourceNotFoundError(res, taskId);
    }

    if (taskTextExistence(todo.tasks, result.taskText, taskId) === true) {
      return res.status(422).json({ msg: 'Task already taken.' });
    }

    const updatedTodoWithTask = await updateTaskTextByTodoIdAndTaskId(userId, todoId, taskId, result.taskText);
    return res.json({ msg: 'Task updated successfully.', todo: updatedTodoWithTask });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(400).json({ msg: err.message });
    }
    return next(err);
  }
};

const putTaskStatus = async (req, res, next) => {
  try {
    const { todoId, taskId } = req.params;
    const { userId } = req.user;

    const todo = await validateTodo(userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    const task = validateTask(todo.tasks, taskId);
    if (task === false) {
      return throwResourceNotFoundError(res, taskId);
    }
    const taskStatus = (task.checked === false);

    const updatedTodoWithTask = await updateTaskStatusByTodoIdAndTaskId(userId, todoId, taskId, taskStatus);
    return res.json({ msg: 'Task updated successfully.', todo: updatedTodoWithTask });
  } catch (err) {
    return next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { todoId, taskId } = req.params;
    const { userId } = req.user;

    const todo = await validateTodo(userId, todoId);
    if (todo === false) {
      return throwResourceNotFoundError(res, todoId);
    }

    if (validateTask(todo.tasks, taskId) === false) {
      return throwResourceNotFoundError(res, taskId);
    }

    const todoAfterDeletedTask = await deleteTaskByTodoIdAndTaskId(todoId, taskId);
    return res.json({ msg: 'Task deleted successfully.', todo: todoAfterDeletedTask });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getTodos,
  getTrashedTodos,
  postTodo,
  getTodo,
  putTodo,
  deleteTodo,
  putTodoToTrash,
  putRestoreTodo,
  postTask,
  putTask,
  putTaskStatus,
  deleteTask,
};

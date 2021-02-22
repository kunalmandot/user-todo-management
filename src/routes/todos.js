const express = require('express');

const {
  getTodos,
  getTrashedTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  moveTodoToTrash,
  restoreTodo,
  shareTodo,
  unshareTodo,
  createTask,
  updateTaskText,
  updateTaskStatus,
  deleteTask,
} = require('../components/todo/todo.controller');
const authenticateToken = require('../middlewares/authenticate-token');
const {
  createOrUpdateTodoValidation,
  shareTodoValidation,
  createOrUpdateTaskValidation,
} = require('../components/todo/todo.middleware');

const router = express.Router();

router.use(authenticateToken);

router.route('/')
  .get(getTodos)
  .post(createOrUpdateTodoValidation, createTodo);

router.route('/trashed')
  .get(getTrashedTodos);

router.route('/:todoId')
  .get(getTodo)
  .put(createOrUpdateTodoValidation, updateTodo)
  .delete(deleteTodo);

router.route('/:todoId/move-to-trash')
  .put(moveTodoToTrash);

router.route('/:todoId/restore')
  .put(restoreTodo);

router.route('/:todoId/share')
  .post(shareTodoValidation, shareTodo);

router.route('/:todoId/unshare/:sharedWithUserId')
  .delete(unshareTodo);

router.route('/:todoId/tasks')
  .post(createOrUpdateTaskValidation, createTask);

router.route('/:todoId/tasks/:taskId')
  .put(createOrUpdateTaskValidation, updateTaskText)
  .delete(deleteTask);

router.route('/:todoId/tasks/:taskId/change-status')
  .put(updateTaskStatus);

module.exports = router;

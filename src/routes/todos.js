const express = require('express');

const {
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
} = require('../components/todo/todo.controller');
const authenticateToken = require('../middlewares/authenticate-token');

const router = express.Router();

router.use(authenticateToken);

router.route('/')
  .get(getTodos)
  .post(postTodo);

router.route('/trashed')
  .get(getTrashedTodos);

router.route('/:todoId')
  .get(getTodo)
  .put(putTodo)
  .delete(deleteTodo);

router.route('/:todoId/move-to-trash')
  .put(putTodoToTrash);

router.route('/:todoId/restore')
  .put(putRestoreTodo);

// router.route('/:todoId/share')
//   .post();

// router.route('/:todoId/unshare')
//   .delete();

router.route('/:todoId/tasks')
  .post(postTask);

router.route('/:todoId/tasks/:taskId')
  .put(putTask)
  .delete(deleteTask);

router.route('/:todoId/tasks/:taskId/change-status')
  .put(putTaskStatus);

module.exports = router;

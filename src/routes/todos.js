const express = require('express');

const {
  getTodos,
  postTodo,
  getTodo,
  putTodo,
  deleteTodo,
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

router.route('/:todoId')
  .get(getTodo)
  .put(putTodo)
  .delete(deleteTodo);

router.route('/trashed')
  .get();

router.route('/:todoId/move-to-trash')
  .put();

router.route('/:todoId/restore')
  .put();

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

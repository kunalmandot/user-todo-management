const express = require('express');

const {
  getTodos,
  postTodo,
  getTodo,
  putTodo,
  deleteTodo,
} = require('../components/todo/todo.controller');
const authenticateToken = require('../middlewares/authenticate-token');

const router = express.Router();

router.route('/')
  .get(authenticateToken, getTodos)
  .post(authenticateToken, postTodo);

router.route('/:todoId')
  .get(authenticateToken, getTodo)
  .put(authenticateToken, putTodo)
  .delete(authenticateToken, deleteTodo);

router.route('/:todoId/move-to-trash')
  .put();

router.route('/:todoId/restore')
  .put();

router.route('/:todoId/share')
  .post();

router.route('/:todoId/unshare')
  .delete();

router.route('/:todoId/tasks')
  .post();

router.route('/:todoId/tasks/:taskId')
  .put()
  .delete();

module.exports = router;

const express = require('express');

const router = express.Router();

router.route('/')
  .get()
  .post();

router.route('/:todoId')
  .get()
  .put()
  .delete();

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

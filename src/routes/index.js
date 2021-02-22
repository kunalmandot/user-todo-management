const express = require('express');

const accounts = require('./accounts');
const todos = require('./todos');

const router = express.Router();

// Accounts route
router.use('/accounts', accounts);

// Todos route
router.use('/todos', todos);

module.exports = router;

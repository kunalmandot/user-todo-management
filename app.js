const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { port, host } = require('./config');
const accounts = require('./src/routes/accounts');
const todos = require('./src/routes/todos');

// Init app
const app = express();

// Connect to database
mongoose.connect('mongodb://localhost:27017/usertodo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser middleware
app.use(cookieParser());

// Accounts route
app.use('/api/accounts', accounts);

// Todos route
app.use('/api/todos', todos);

// Error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ msg: 'Something went wrong.' });
});

app.listen(port, host, () => {
  console.log(`Server started on ${host} : ${port}`);
});

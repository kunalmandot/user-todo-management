const express = require('express');
const mongoose = require('mongoose');

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

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// accounts route
app.use('/api/accounts', accounts);

// todos route
app.use('/api/todos', todos);

app.listen(port, host, () => {
  console.log(`Server started on ${host} : ${port}`);
});

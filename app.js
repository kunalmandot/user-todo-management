const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const { port, host } = require('./config');
const index = require('./src/routes/index');
const scheduler = require('./src/schedular/index');

// Init app
const app = express();

// Connect to database
mongoose.connect('mongodb://localhost:27017/usertodo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// morgan middleware
app.use(morgan('dev'));

// cors middleware
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors());

// Body parser middleware
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Actual routes
app.use('/api', index);

// Error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ msg: 'Something went wrong.' });
});

app.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`);
});

scheduler();

const express = require('express');
const mongoose = require('mongoose');
const HTTPError = require('./models/HTTPError');
const { StatusCodes } = require('http-status-codes');
const bodyParser = require('body-parser');
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');
const sharedNotesRoutes = require('./routes/shared-notes');
const resetPasswordRoutes = require('./routes/reset-password');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// delay
app.use((req, res, next) => {
  SERVER_DELAY = 500;
  setTimeout(() => next(), SERVER_DELAY);
});

app.use('/api/notes', notesRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/shared', sharedNotesRoutes);
app.use('/api/reset_password', resetPasswordRoutes);

app.use((req, res, next) => {
  throw new HTTPError('Could not find route.', StatusCodes.NOT_FOUND);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: error.message || 'An unknown error occurred.' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    app.listen(process.env.PORT);
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
};

startServer();

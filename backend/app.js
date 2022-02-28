const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');
const sharedNotesRoutes = require('./routes/shared-notes');
require('dotenv').config();

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    app.listen(process.env.PORT);
    console.log(`Listening to port ${process.env.PORT}.`);
  } catch (error) {
    console.log(error);
  }
};

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/notes', notesRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/shared', sharedNotesRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find route.', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred.' });
});

startServer();

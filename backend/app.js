const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');
const sharedNotesRoutes = require('./routes/shared-notes');
require('dotenv').config();

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

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.7bddq.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(process.env.PORT);
    console.log(`Listening to port ${process.env.PORT}.`);
  })
  .catch((err) => {
    console.log(err);
  });

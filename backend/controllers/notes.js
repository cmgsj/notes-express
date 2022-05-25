const Note = require('../models/note');
const User = require('../models/user');
const HTTPError = require('../models/HTTPError');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.getNotes = async (req, res, next) => {
  const userId = req.userData.userId;
  let user;
  try {
    user = await User.findById(userId).populate('notes');
  } catch (err) {
    return next(
      new HTTPError(
        'Fetching notes failed, plase try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!user)
    return next(new HTTPError('User not found.', StatusCodes.NOT_FOUND));

  res.status(StatusCodes.OK).json({
    message: 'Notes fetched succesfully.',
    notes: user.notes.map((note) => note.toObject({ getters: true })),
  });
};

exports.createNote = async (req, res, next) => {
  let { title, content } = req.body;
  const userId = req.userData.userId;
  if (title === '') {
    if (content === '') {
      title = 'Empty Note';
      content = ' ';
    } else {
      title = 'Untitled';
    }
  }
  if (content === '') {
    content = ' ';
  }
  const newNote = new Note({
    title: title,
    content: content,
    author: userId,
  });
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new HTTPError('Creating note failed, please try again.', StatusCodes.in)
    );
  }
  if (!user) {
    return next(
      new HTTPError(
        'Could not find user for provided id',
        StatusCodes.NOT_FOUND
      )
    );
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newNote.save({ session: session });
    user.notes.push(newNote);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HTTPError(
        'Creating note failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(StatusCodes.CREATED).json({
    message: 'Note created successfully.',
    note: newNote.toObject({ getters: true }),
  });
};

exports.updateNote = async (req, res, next) => {
  let { title, content } = req.body;
  const noteId = req.params.noteId;
  const userId = req.userData.userId;
  if (title === '') {
    if (content === '') {
      title = 'Empty Note';
      content = ' ';
    } else {
      title = 'Untitled';
    }
  }
  if (content === '') {
    content = ' ';
  }
  let note;
  try {
    note = await Note.findById(noteId);
  } catch (err) {
    return next(
      new HTTPError(
        'Something went wrong, could not update note.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (note.author.toString() !== userId) {
    return next(
      new HTTPError('Update note not allowed.', StatusCodes.FORBIDDEN)
    );
  }
  note.title = title;
  note.content = content;
  try {
    await note.save();
  } catch (err) {
    return next(
      new HTTPError(
        'Something went wrong, could not update note.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ message: 'Note updated.', note: note.toObject({ getters: true }) });
};

exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const userId = req.userData.userId;
  let note;
  try {
    note = await Note.findById(noteId).populate('author');
  } catch (err) {
    return next(
      new HTTPError(
        'Something went wrong, could not delete note.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!note) {
    return next(
      new HTTPError('Could not find note for this id.', StatusCodes.NOT_FOUND)
    );
  }
  if (note.author.id !== userId) {
    return next(
      new HTTPError('Delete note not allowed.', StatusCodes.FORBIDDEN)
    );
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await note.remove({ session: session });
    note.author.notes.pull(note);
    await note.author.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HTTPError(
        'Something went wrong, could not delete note.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(StatusCodes.OK).json({ message: 'Note deleted.', noteId: noteId });
};

exports.shareNote = async (req, res, next) => {
  const userId = req.userData.userId;
  const { noteId, permission, expiresIn } = req.body;
  if (
    (permission !== 'READ_ONLY' && permission !== 'READ_WRITE') ||
    (expiresIn && !Number.isInteger(expiresIn))
  ) {
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new HTTPError('Something went wrong.', StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
  if (!user) {
    return next(new HTTPError('User not found.', StatusCodes.NOT_FOUND));
  }
  let token;
  try {
    if (expiresIn) {
      token = jwt.sign(
        {
          userId: userId,
          noteId: noteId,
          permission: permission,
        },
        process.env.JWT_ACCESS_TOKEN_KEY,
        { expiresIn: `${expiresIn}h` }
      );
    } else {
      token = jwt.sign(
        {
          userId: userId,
          noteId: noteId,
          permission: permission,
        },
        process.env.JWT_ACCESS_TOKEN_KEY
      );
    }
  } catch (error) {
    return next(
      new HTTPError(
        'Sharing note failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ message: 'Sharing token succesfully created.', token: token });
};

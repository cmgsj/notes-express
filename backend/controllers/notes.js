const Note = require('../models/note');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.getNotes = async (req, res, next) => {
  const userId = req.userData.userId;
  let user;
  try {
    user = await (await User.findById(userId)).populate('notes');
  } catch (err) {
    return next(new HttpError('Fetching notes failed, plase try again.', 500));
  }
  if (!user) {
    return next(new HttpError('User not found.', 404));
  }
  // if (user.notes.length === 0) {
  //   return next(new HttpError('Could not find notes for provided user.', 404));
  // }
  res.json({
    message: 'Notes fetched succesfully,',
    notes: user.notes.map((note) => note.toObject({ getters: true })),
  });
};

exports.createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs, please check your data.', 422));
  }
  const { title, content } = req.body;
  const userId = req.userData.userId;
  const newNote = new Note({
    title: title,
    content: content,
    author: userId,
  });
  let user;
  try {
    user = await User.findById(userId);
    // await note.save();
    // res.status(201).json({
    //   message: 'Note created successfully!',
    //   note: note,
    // });
  } catch (err) {
    return next(new HttpError('Creating note failed, please try again', 500));
  }
  if (!user) {
    return next(new HttpError('Could not find user for provided id', 404));
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newNote.save({ session: session });
    user.notes.push(newNote);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating note failed, please try again.', 500));
  }
  res.status(201).json({
    message: 'Note created successfully!',
    note: newNote.toObject({ getters: true }),
  });
};

exports.updateNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, content } = req.body;
  const noteId = req.params.noteId;
  const userId = req.userData.userId;
  let note;
  try {
    note = await Note.findById(noteId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not update note.', 500)
    );
  }
  if (note.author.toString() !== userId) {
    return next(new HttpError('Update note not allowed.', 401));
  }
  note.title = title;
  note.content = content;
  try {
    await note.save();
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not update note.', 500)
    );
  }
  res
    .status(200)
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
      new HttpError('Something went wrong, could not delete note.', 500)
    );
  }
  if (!note) {
    return next(new HttpError('Could not find note for this id.', 404));
  }
  if (note.author.id !== userId) {
    return next(new HttpError('Delete note not allowed.', 401));
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
      new HttpError('Something went wrong, could not delete note.', 500)
    );
  }
  res.status(200).json({ message: 'Note deleted.', noteId: noteId });
};

exports.shareNote = async (req, res, next) => {
  const userId = req.userData.userId;
  const { noteId, permission, expiresIn } = req.body;
  if (permission !== 'READ_ONLY' && permission !== 'READ_WRITE') {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  if (expiresIn && !Number.isInteger(expiresIn)) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError('Something went wrong.', 500));
  }
  if (!user) {
    return next(new HttpError('User not found.', 404));
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
        process.env.JWT_KEY,
        { expiresIn: `${expiresIn}h` }
      );
    } else {
      token = jwt.sign(
        {
          userId: userId,
          noteId: noteId,
          permission: permission,
        },
        process.env.JWT_KEY
      );
    }
  } catch (error) {
    return next(new HttpError('Sharing note failed, please try again.', 500));
  }
  res.json({ message: 'Sharing token succesfully created.', token: token });
};

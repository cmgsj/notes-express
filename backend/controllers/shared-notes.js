const Note = require('../models/note');
const HTTPError = require('../models/HTTPError');
const { StatusCodes } = require('http-status-codes');

exports.getNote = async (req, res, next) => {
  const { userId, noteId, permission } = req.sharingData;
  if (permission !== 'READ_ONLY' && permission !== 'READ_WRITE') {
    return next(
      new HTTPError('Viewing note not allowed.', StatusCodes.FORBIDDEN)
    );
  }
  let note;
  try {
    note = await Note.findById(noteId);
  } catch (err) {
    return next(
      new HTTPError(
        'Fetching note failed, plase try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!note) {
    return next(new HTTPError('Note not found.', StatusCodes.NOT_FOUND));
  }
  if (note.author.toString() !== userId) {
    return next(new HTTPError('View note not allowed.', StatusCodes.FORBIDDEN));
  }
  res.status(StatusCodes.OK).json({
    message: 'Note fetched succesfully,',
    note: { title: note.title, content: note.content },
    permission,
  });
};

exports.updateNote = async (req, res, next) => {
  const { userId, noteId, permission } = req.sharingData;
  let { title, content } = req.body;
  if (permission !== 'READ_WRITE') {
    return next(
      new HTTPError('Updating note not allowed.', StatusCodes.FORBIDDEN)
    );
  }
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
  res.status(StatusCodes.OK).json({
    message: 'Note updated.',
    note: { title: note.title, content: note.content },
  });
};

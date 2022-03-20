const Note = require('../models/note');
const HttpError = require('../models/http-error');

exports.getNote = async (req, res, next) => {
  const { userId, noteId, permission } = req.sharingData;
  if (permission !== 'READ_ONLY' && permission !== 'READ_WRITE') {
    return next(new HttpError('Viewing note not allowed.', 401));
  }
  let note;
  try {
    note = await Note.findById(noteId);
  } catch (err) {
    return next(new HttpError('Fetching note failed, plase try again.', 500));
  }
  if (!note) {
    return next(new HttpError('Note not found.', 404));
  }
  if (note.author.toString() !== userId) {
    return next(new HttpError('View note not allowed.', 401));
  }
  res.json({
    message: 'Note fetched succesfully,',
    note: { title: note.title, content: note.content },
    permission,
  });
};

exports.updateNote = async (req, res, next) => {
  const { userId, noteId, permission } = req.sharingData;
  let { title, content } = req.body;
  if (permission !== 'READ_WRITE') {
    return next(new HttpError('Updating note not allowed.', 401));
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
  res.status(200).json({
    message: 'Note updated.',
    note: { title: note.title, content: note.content },
  });
};

const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.params.token;
    if (!token) throw new Error();
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY);
    if (!decodedToken) throw new Error();
    req.sharingData = {
      userId: decodedToken.userId,
      noteId: decodedToken.noteId,
      permission: decodedToken.permission,
    };
    next();
  } catch (error) {
    return next(new HttpError('Authentication failed.', 403));
  }
};

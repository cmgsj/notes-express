const jwt = require('jsonwebtoken');
const HTTPError = require('../models/HTTPError');
const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error();
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY);
    if (!decodedToken) throw new Error();
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(
      new HTTPError('Authentication failed.', StatusCodes.UNAUTHORIZED)
    );
  }
};

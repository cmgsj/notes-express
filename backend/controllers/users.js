const HTTPError = require('../models/HTTPError');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  if (password !== confirmedPassword)
    return next(
      new HTTPError(
        'Passwords must match, plase try again',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HTTPError(
        'Signing up failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (existingUser)
    return next(
      new HTTPError(
        'User exists already, please login instead.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HTTPError(
        'Could not create user, plase try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    notes: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HTTPError(
        'Signing up failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  let token;
  let refreshToken;
  try {
    token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_ACCESS_TOKEN_KEY,
      {
        expiresIn: '1h',
      }
    );
    refreshToken = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_REFRESH_TOKEN_KEY,
      {
        expiresIn: '1d',
      }
    );
  } catch (error) {
    return next(
      new HTTPError(
        'Logging in failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(StatusCodes.CREATED).json({
    userId: createdUser.id,
    email: createdUser.email,
    token,
    refreshToken,
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HTTPError(
        'Logging in failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!existingUser) {
    return next(
      new HTTPError(
        'Invalid credentials, could not log you in.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HTTPError(
        'Could not log you in, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!isValidPassword) {
    return next(
      new HTTPError(
        'Invalid credentials, could not log you in.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  let token;
  let refreshToken;
  try {
    token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_ACCESS_TOKEN_KEY,
      {
        expiresIn: '1h',
      }
    );
    refreshToken = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_REFRESH_TOKEN_KEY,
      {
        expiresIn: '1d',
      }
    );
  } catch (error) {
    return next(
      new HTTPError(
        'Logging in failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(StatusCodes.OK).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
    refreshToken,
  });
};

exports.refreshToken = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  const { refreshToken } = req.body;
  const userId = req.userData.userId;
  try {
    if (!refreshToken) throw new Error();
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_KEY
    );
    if (!decodedToken) throw new Error();
    if (userId !== decodedToken.userId) throw new Error();
  } catch (error) {
    return next(
      new HTTPError('Authentication failed.', StatusCodes.UNAUTHORIZED)
    );
  }
  let token;
  try {
    token = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(
      new HTTPError(
        'Refreshing token failed, please try again.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  res.status(StatusCodes.OK).json({ token });
};

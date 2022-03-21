const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  if (password !== confirmedPassword)
    return next(new HttpError('Passwords must match, plase try again', 422));
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again.', 500));
  }
  if (existingUser)
    return next(
      new HttpError('User exists already, please login instead.', 422)
    );
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Could not create user, plase try again.', 500));
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
    return next(new HttpError('Signing up failed, please try again.', 500));
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
    return next(new HttpError('Logging in failed, please try again.', 500));
  }
  res.status(201).json({
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
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError('Logging in failed, please try again later.', 500)
    );
  }
  if (!existingUser) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError('Could not log you in, please try again.', 500));
  }
  if (!isValidPassword) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
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
    return next(new HttpError('111Logging in failed, please try again.', 500));
  }
  res.status(200).json({
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
      new HttpError('Invalid inputs passed, please check your data.', 422)
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
    return next(new HttpError('Authentication failed.', 401));
  }
  let token;
  try {
    token = jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_KEY, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(
      new HttpError('Refreshing token failed, please try again.', 500)
    );
  }
  res.status(200).json({ token });
};

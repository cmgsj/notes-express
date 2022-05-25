const HTTPError = require('../models/HTTPError');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendPasswordResetCode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
  const { email } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HTTPError(
        'Sending code failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (existingUser) {
    let token;
    let hashedResetToken;
    let jwtToken;
    try {
      token = crypto.randomBytes(16).toString('hex');
      hashedResetToken = await bcrypt.hash(token, 12);
      if (!hashedResetToken) {
        throw new Error();
      }
      jwtToken = jwt.sign(
        {
          userId: existingUser.id,
          email: existingUser.email,
          passwordResetToken: token,
        },
        process.env.JWT_ACCESS_TOKEN_KEY,
        { expiresIn: '1h' }
      );
    } catch (error) {
      return next(
        new HTTPError(
          'Sending code failed, please try again later.',
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    if (!hashedResetToken || !jwtToken) {
      return next(
        new HTTPError(
          'Sending code failed, please try again later.',
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    existingUser.passwordResetToken = hashedResetToken;
    try {
      await existingUser.save();
    } catch (error) {
      return next(
        new HTTPError(
          'Sending code failed, please try again later.',
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Notes-Express Password Reset Code',
      html: `<h3>Hello ${existingUser.firstName} ${existingUser.lastName},</h3>
      <p>Follow this
      <a href="http://localhost:3000/reset_password/${jwtToken}">link</a>
      to reset your Notes-Express password.</p>`,
    };
    // transporter.sendMail(mailOptions, (error, data) => {
    //   if (error)
    //     return next(
    //       new HTTPError(
    //         'Could not send email.',
    //         StatusCodes.INTERNAL_SERVER_ERROR
    //       )
    //     );
    // });
    console.log(`http://localhost:3000/reset_password/${jwtToken}`);
  }
  res.status(StatusCodes.OK).json({ message: 'Passord reset code sent.' });
};

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HTTPError(
        'Invalid inputs passed, please check your data.',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
  const { password, confirmedPassword } = req.body;
  const { userId, email, passwordResetToken } = req.userResetPasswordData;
  if (password !== confirmedPassword) {
    return next(
      new HTTPError(
        'Passwords must match, plase try again',
        StatusCodes.UNPROCESSABLE_ENTITY
      )
    );
  }
  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!existingUser || existingUser.email !== email) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  let isValidResetToken = false;
  try {
    isValidResetToken = await bcrypt.compare(
      passwordResetToken,
      existingUser.passwordResetToken
    );
  } catch (error) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!isValidResetToken) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  if (!hashedPassword) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
  existingUser.password = hashedPassword;
  try {
    await existingUser.save();
  } catch (error) {
    return next(
      new HTTPError(
        'Reseting password failed, please try again later.',
        StatusCodes.INTERNAL_SERVER_ERROR
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
    message: 'Passord reset succesfully.',
    userId: existingUser.id,
    token,
    refreshToken,
  });
};

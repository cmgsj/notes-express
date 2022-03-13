const HttpError = require('../models/http-error');
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
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { email } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError('Sending code failed, please try again later.', 500)
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
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (error) {
      return next(
        new HttpError('Sending code failed, please try again later.', 500)
      );
    }
    if (!hashedResetToken || !jwtToken) {
      return next(
        new HttpError('Sending code failed, please try again later.', 500)
      );
    }
    existingUser.passwordResetToken = hashedResetToken;
    try {
      await existingUser.save();
    } catch (error) {
      return next(
        new HttpError('Sending code failed, please try again later.', 500)
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
      html: `<h3>
              Follow this 
              <a href="http://localhost:3000/reset_password/${jwtToken}">link</a>
              to reset your Notes-Express password.
            </h3>`,
    };
    // transporter.sendMail(mailOptions, (error, data) => {
    //   if (error) {
    //     return next(new HttpError('Could not send email.', 500));
    //   }
    // });
    console.log(`http://localhost:3000/reset_password/${jwtToken}`);
  }
  res.status(200).json({ message: 'Passord reset code sent.' });
};

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { password } = req.body;
  const { userId, email, passwordResetToken } = req.userResetPasswordData;
  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  if (!existingUser || existingUser.email !== email) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
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
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  if (!isValidResetToken) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  if (!hashedPassword) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  existingUser.password = hashedPassword;
  try {
    await existingUser.save();
  } catch (error) {
    return next(
      new HttpError('Reseting password failed, please try again later.', 500)
    );
  }
  res.status(200).json({ message: 'Passord reset succesfully.' });
};

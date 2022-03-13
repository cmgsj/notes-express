const express = require('express');
const { check } = require('express-validator');
const passwordResetController = require('../controllers/reset-password');
const checkPasswordResetToken = require('../middleware/password-reset-token');

const router = express.Router();

router.post(
  '/send_code',
  check('email').normalizeEmail().isEmail(),
  passwordResetController.sendPasswordResetCode
);

router.post(
  '/:token',
  check('password').isLength({ min: 8 }),
  checkPasswordResetToken,
  passwordResetController.resetPassword
);

module.exports = router;

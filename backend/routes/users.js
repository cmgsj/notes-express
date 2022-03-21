const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/signup',
  [
    check('firstName')
      .isAlpha('en-US', { ignore: ' ' })
      .isLength({ min: 2, max: 20 }),
    check('lastName')
      .isAlpha('en-US', { ignore: ' ' })
      .isLength({ min: 2, max: 20 }),
    check('email').normalizeEmail().isEmail(),
    check('password').isStrongPassword(),
    check('confirmedPassword').isStrongPassword(),
  ],
  usersController.signup
);

router.post(
  '/login',
  [check('email').normalizeEmail().isEmail()],
  usersController.login
);

router.post(
  '/refresh_token',
  [check('refreshToken').isJWT()],
  checkAuth,
  usersController.refreshToken
);

module.exports = router;

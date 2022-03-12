const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.post(
  '/send_code',
  [check('email').normalizeEmail().isEmail()],
  usersController.sendPasswordResetCode
);

module.exports = router;

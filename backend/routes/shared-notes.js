const express = require('express');
const { check } = require('express-validator');
const sharedNotesController = require('../controllers/shared-notes');
const checkSharingToken = require('../middleware/sharing-token');

const router = express.Router();

router.use('/:token', checkSharingToken);

router.get('/:token', sharedNotesController.getNote);

router.put(
  '/:token',
  [check('title').notEmpty(), check('content').notEmpty()],
  sharedNotesController.updateNote
);

module.exports = router;

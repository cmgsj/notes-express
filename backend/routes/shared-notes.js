const express = require('express');
const sharedNotesController = require('../controllers/shared-notes');
const checkSharingToken = require('../middleware/sharing-token');

const router = express.Router();

router.use(checkSharingToken);

router.get('/:token', sharedNotesController.getNote);

router.put('/:token', sharedNotesController.updateNote);

module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const notesController = require('../controllers/notes');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get('/', notesController.getNotes);

router.post(
  '/',
  [check('title').notEmpty(), check('content').notEmpty()],
  notesController.createNote
);

router.put(
  '/:noteId',
  [check('title').notEmpty(), check('content').notEmpty()],
  notesController.updateNote
);

router.delete('/:noteId', notesController.deleteNote);

router.post('/share', notesController.shareNote);

module.exports = router;

const express = require('express');
const notesController = require('../controllers/notes');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get('/', notesController.getNotes);

router.post('/', notesController.createNote);

router.put('/:noteId', notesController.updateNote);

router.delete('/:noteId', notesController.deleteNote);

router.post('/share', notesController.shareNote);

module.exports = router;

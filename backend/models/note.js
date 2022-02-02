const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);

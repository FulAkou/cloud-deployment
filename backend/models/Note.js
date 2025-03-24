const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: { type: String, required: true },
  tags: { type: [String], default: [], required: true },
  content: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

Note = model("Note", noteSchema);

module.exports = Note;

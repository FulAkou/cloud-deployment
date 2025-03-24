const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Get all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a new note
router.post("/note", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    tags: req.body.tags,
    content: req.body.content,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a note
router.put("/note/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id);
    note.title = req.body.title;
    note.tags = req.body.tags;
    note.content = req.body.content;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a note
router.delete("/note/:id", async (req, res) => {
  try {
    // Mise à jour du champ isDeleted à true au lieu de supprimer la note
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true } // Retourner la note mise à jour
    );

    if (!note) {
      return res.status(404).json({ message: "Note non trouvée" });
    }

    res.json({ message: "Note marquée comme supprimée", note });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//update isPinned value
router.put("/update-note-pined/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id);
    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

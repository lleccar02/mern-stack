const notesCtrl = {};

const Note = require('../models/Note');

notesCtrl.getNotes = async (req, res) => {
  const notes = await Note.find();
  res.json({ notes });
};

notesCtrl.saveNote = async (req, res) => {
  const { title, content, author, date } = req.body;
  const newNote = new Note({
    title: title,
    content: content,
    author: author,
    date: date,
  });
  await newNote.save();
  res.json({message: 'Note saved'});
};

notesCtrl.getNote = async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  res.json({ note });
};

notesCtrl.updateNote = async (req, res) => {
  const id = req.params.id;
  const { title, content, author } = req.body;
  await Note.findOneAndUpdate({_id: id}, {
    title: title,
    content: content,
    author: author
  });

  res.json({message: 'Note updated'})
};

notesCtrl.deleteNote = async (req, res) => {
  const id = req.params.id;
  await Note.findOneAndDelete({_id: id});
  res.json({message: 'Note deleted'});
};

module.exports = notesCtrl;
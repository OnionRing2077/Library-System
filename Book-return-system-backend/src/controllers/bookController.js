const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, image } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title/Author required' });

  try {
    const newBook = await Book.create({ title, author, image });
    res.status(201).json({ message: 'Book created', book: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
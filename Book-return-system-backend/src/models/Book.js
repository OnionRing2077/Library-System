const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, default: '' },
  status: { type: String, enum: ['available', 'borrowed', 'pending'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
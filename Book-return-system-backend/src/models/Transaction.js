const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrow_date: { type: Date, default: Date.now },
  return_date: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'approved', 'returned', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Transaction', transactionSchema);
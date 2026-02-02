const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

exports.borrowBook = async (req, res) => {
    const { user_id, book_id } = req.body;
    try {
        const book = await Book.findById(book_id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.status !== 'available') return res.status(400).json({ message: 'Book is not available' });

        // สร้าง Transaction (สถานะ pending) และ อัปเดตสถานะหนังสือเป็น pending
        await Transaction.create({ user_id, book_id, status: 'pending' });
        await Book.findByIdAndUpdate(book_id, { status: 'pending' });

        res.status(201).json({ message: 'Borrow request sent. Waiting for approval.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveBorrow = async (req, res) => {
    const { transaction_id } = req.body;
    try {
        const transaction = await Transaction.findById(transaction_id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        if (transaction.status !== 'pending') return res.status(400).json({ message: 'Request is not pending' });

        // อนุมัติ: เปลี่ยนสถานะ transaction เป็น approved, หนังสือเป็น borrowed
        transaction.status = 'approved';
        await transaction.save();

        await Book.findByIdAndUpdate(transaction.book_id, { status: 'borrowed' });

        res.json({ message: 'Borrow approved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectBorrow = async (req, res) => {
    const { transaction_id } = req.body;
    try {
        const transaction = await Transaction.findById(transaction_id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        
        // ปฏิเสธ: เปลี่ยนสถานะ transaction เป็น rejected, หนังสือเป็น available
        transaction.status = 'rejected';
        await transaction.save();

        await Book.findByIdAndUpdate(transaction.book_id, { status: 'available' });

        res.json({ message: 'Borrow rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.returnBook = async (req, res) => {
    const { user_id, book_id } = req.body;
    try {
        // หา Transaction ที่ Active อยู่ (Allow Approved or Pending)
        const transaction = await Transaction.findOne({
            user_id,
            book_id,
            status: { $in: ['approved', 'pending'] },
            return_date: null
        });

        if (!transaction) return res.status(400).json({ message: 'No active approved/pending borrow record' });

        // ถ้า Pending -> ถือว่า Cancel Request (ลบหรือ Reject ก็ได้ แต่ในที่นี้ set returned เพื่อปิด job)
        // ถ้า Approved -> คืนหนังสือปกติ
        const isPending = transaction.status === 'pending';

        transaction.return_date = new Date();
        transaction.status = 'returned'; // หรือ 'cancelled' ถ้าสถานะรองรับ
        await transaction.save();

        await Book.findByIdAndUpdate(book_id, { status: 'available' });

        res.json({ message: isPending ? 'Request cancelled' : 'Return successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        // .populate() คือทีเด็ดของ Mongoose (เหมือน JOIN ตาราง)
        const history = await Transaction.find({ user_id: req.params.user_id })
                                         .populate('book_id', 'title author')
                                         .sort({ borrow_date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        // activeLoans คือที่ approved แล้วยังไม่คืน
        const activeLoans = await Transaction.find({ status: 'approved', return_date: null })
                                             .populate('user_id', 'username full_name')
                                             .populate('book_id', 'title author')
                                             .sort({ borrow_date: -1 });

        // pendingRequests คือที่รออนุมัติ
        const pendingRequests = await Transaction.find({ status: 'pending' })
                                             .populate('user_id', 'username full_name')
                                             .populate('book_id', 'title author')
                                             .sort({ borrow_date: -1 });

        res.json({ activeLoans, pendingRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// POST /api/transactions/borrow
router.post('/borrow', verifyToken, transactionController.borrowBook);

// POST /api/transactions/return
router.post('/return', verifyToken, transactionController.returnBook);

// GET /api/transactions/history/:user_id
router.get('/history/:user_id', verifyToken, transactionController.getHistory);

// GET /api/transactions/dashboard (Admin Only)
router.get('/dashboard', verifyToken, isAdmin, transactionController.getDashboard);

// POST /api/transactions/approve (Admin Only)
router.post('/approve', verifyToken, isAdmin, transactionController.approveBorrow);

// POST /api/transactions/reject (Admin Only)
router.post('/reject', verifyToken, isAdmin, transactionController.rejectBorrow);

module.exports = router;
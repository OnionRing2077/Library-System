const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
// นำเข้า Middleware
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// ใครๆ ก็ดูรายการหนังสือได้
router.get('/', bookController.getAllBooks);

// POST: เพิ่มหนังสือ (บรรทัดนี้สำคัญ! เช็คว่ามีอยู่ไหม)
//router.post('/', bookController.createBook);

// ต้องล็อกอิน และเป็น Admin เท่านั้น ถึงจะเพิ่มหนังสือได้   
router.post('/', verifyToken, isAdmin, bookController.createBook);

module.exports = router;
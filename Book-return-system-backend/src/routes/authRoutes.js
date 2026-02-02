const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);


// PUT /api/auth/profile
router.put('/profile', verifyToken, authController.updateProfile);

// GET /api/auth/users (Admin Only)
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);

module.exports = router;
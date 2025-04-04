const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Route đăng ký
router.post('/register', authController.register);

// Route đăng nhập
router.post('/login', authController.login);

// Route lấy thông tin người dùng hiện tại
router.get('/me', verifyToken, authController.getCurrentUser);

// Route đổi mật khẩu
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router; 
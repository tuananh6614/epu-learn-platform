const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes chỉ dành cho admin
router.get('/', verifyToken, checkRole(['admin']), userController.getAllUsers);
router.get('/:id', verifyToken, checkRole(['admin']), userController.getUserById);
router.put('/:id', verifyToken, checkRole(['admin']), userController.updateUser);
router.delete('/:id', verifyToken, checkRole(['admin']), userController.deleteUser);

// Route cập nhật thông tin cá nhân (cho tất cả người dùng)
router.put('/profile/update', verifyToken, userController.updateProfile);

module.exports = router; 
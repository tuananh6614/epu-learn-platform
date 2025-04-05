
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Controllers will be implemented later
const userController = require('../controllers/user.controller');

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// Get user by id
router.get('/:id', verifyToken, userController.getUserById);

// Create new user (admin only)
router.post('/', verifyToken, isAdmin, userController.createUser);

// Update user
router.put('/:id', verifyToken, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;

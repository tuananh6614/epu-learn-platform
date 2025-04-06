const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const majorController = require('../controllers/major.controller');

// Public routes
router.get('/majors', majorController.getMajors);

// Admin routes
router.post('/majors', verifyToken, isAdmin, majorController.addMajor);
router.put('/majors/:major_id', verifyToken, isAdmin, majorController.updateMajor);
router.delete('/majors/:major_id', verifyToken, isAdmin, majorController.deleteMajor);

module.exports = router; 
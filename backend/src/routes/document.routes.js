const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const {
  getDocuments,
  getCategories,
  addDocument,
  downloadDocument,
  purchaseDocument
} = require('../controllers/document.controller');

// Routes công khai
router.get('/documents', getDocuments);
router.get('/categories', getCategories);

// Routes yêu cầu đăng nhập
router.get('/documents/:document_id/download', verifyToken, downloadDocument);
router.post('/documents/:document_id/purchase', verifyToken, purchaseDocument);

// Routes cho admin
router.post('/documents', verifyToken, isAdmin, addDocument);

module.exports = router; 
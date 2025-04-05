
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const documentController = require('../controllers/document.controller');

// Public routes
router.get('/documents', documentController.getDocuments);
router.get('/categories', documentController.getCategories);

// User routes (protected)
router.get('/user/documents', verifyToken, documentController.getUserDocuments);
router.get('/documents/:document_id/download', verifyToken, documentController.downloadDocument);
router.post('/documents/:document_id/purchase', verifyToken, documentController.purchaseDocument);

// Admin routes
router.post('/documents', verifyToken, isAdmin, documentController.addDocument);
router.put('/documents/:document_id', verifyToken, isAdmin, documentController.updateDocument);
router.delete('/documents/:document_id', verifyToken, isAdmin, documentController.deleteDocument);

module.exports = router;

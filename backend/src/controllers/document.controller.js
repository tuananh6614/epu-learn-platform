
const db = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  },
  fileFilter: (req, file, cb) => {
    // Check allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Loại file không được hỗ trợ'));
    }
  }
}).single('file');

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const [documents] = await db.execute(`
      SELECT d.document_id as id, d.title, d.description, d.price, d.file_path, 
             d.created_at, dc.category_name 
      FROM Documents d 
      LEFT JOIN Document_Categories dc ON d.category_id = dc.category_id
      ORDER BY d.created_at DESC
    `);

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài liệu' });
  }
};

// Get document categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM Document_Categories');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục' });
  }
};

// Get user's purchased documents
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [documents] = await db.execute(`
      SELECT d.document_id as id, d.title, d.description, d.price, d.file_path, 
             d.created_at, dc.category_name, dt.created_at as purchase_date
      FROM Documents d 
      JOIN Document_Transactions dt ON d.document_id = dt.document_id
      LEFT JOIN Document_Categories dc ON d.category_id = dc.category_id
      WHERE dt.user_id = ?
      ORDER BY dt.created_at DESC
    `, [userId]);

    res.json(documents);
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tài liệu của người dùng' });
  }
};

// Add new document
exports.addDocument = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, description, price, category_id } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Vui lòng chọn file tài liệu' });
      }

      const [result] = await db.execute(
        'INSERT INTO Documents (title, description, file_path, price, category_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, file.path, price, category_id]
      );

      res.status(201).json({
        message: 'Thêm tài liệu thành công',
        document: {
          id: result.insertId,
          title,
          description,
          file_path: file.path,
          price,
          category_id
        }
      });
    } catch (error) {
      console.error('Add document error:', error);
      res.status(500).json({ message: 'Lỗi khi thêm tài liệu' });
    }
  });
};

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const { title, description, price, category_id } = req.body;

    await db.execute(
      'UPDATE Documents SET title = ?, description = ?, price = ?, category_id = ? WHERE document_id = ?',
      [title, description, price, category_id, document_id]
    );

    res.json({ message: 'Cập nhật tài liệu thành công' });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật tài liệu' });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { document_id } = req.params;

    // Get document details to delete the file
    const [documents] = await db.execute(
      'SELECT file_path FROM Documents WHERE document_id = ?',
      [document_id]
    );

    if (documents.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    // Delete from database
    await db.execute('DELETE FROM Documents WHERE document_id = ?', [document_id]);

    // Delete file from storage
    const filePath = documents[0].file_path;
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (fileErr) {
        console.error('Error deleting file:', fileErr);
        // Continue even if file deletion fails
      }
    }

    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Lỗi khi xóa tài liệu' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const userId = req.user.userId;

    // Check access rights
    const [transactions] = await db.execute(
      'SELECT * FROM Document_Transactions WHERE user_id = ? AND document_id = ?',
      [userId, document_id]
    );

    const [document] = await db.execute(
      'SELECT * FROM Documents WHERE document_id = ?',
      [document_id]
    );

    if (document.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    // If document is free or user has purchased it
    if (document[0].price === 0 || transactions.length > 0) {
      const filePath = document[0].file_path;
      res.download(filePath);
    } else {
      res.status(403).json({ message: 'Bạn cần mua tài liệu này để tải xuống' });
    }
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ message: 'Lỗi khi tải tài liệu' });
  }
};

// Purchase document
exports.purchaseDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const userId = req.user.userId;

    // Check if already purchased
    const [existingTransaction] = await db.execute(
      'SELECT * FROM Document_Transactions WHERE user_id = ? AND document_id = ?',
      [userId, document_id]
    );

    if (existingTransaction.length > 0) {
      return res.status(400).json({ message: 'Bạn đã mua tài liệu này' });
    }

    // Get document info
    const [document] = await db.execute(
      'SELECT * FROM Documents WHERE document_id = ?',
      [document_id]
    );

    if (document.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    // Add new transaction
    await db.execute(
      'INSERT INTO Document_Transactions (user_id, document_id, amount) VALUES (?, ?, ?)',
      [userId, document_id, document[0].price]
    );

    res.json({ message: 'Mua tài liệu thành công' });
  } catch (error) {
    console.error('Purchase document error:', error);
    res.status(500).json({ message: 'Lỗi khi mua tài liệu' });
  }
};

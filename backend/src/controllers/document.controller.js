const db = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique bằng timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file cho phép
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

// Lấy danh sách tài liệu
exports.getDocuments = async (req, res) => {
  try {
    const [documents] = await db.execute(`
      SELECT d.*, dc.category_name 
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

// Lấy danh sách categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM Document_Categories');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách danh mục' });
  }
};

// Thêm tài liệu mới
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
          document_id: result.insertId,
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

// Tải tài liệu
exports.downloadDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const userId = req.user.userId;

    // Kiểm tra quyền truy cập
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

    // Nếu tài liệu miễn phí hoặc người dùng đã mua
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

// Mua tài liệu
exports.purchaseDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const userId = req.user.userId;

    // Kiểm tra xem đã mua chưa
    const [existingTransaction] = await db.execute(
      'SELECT * FROM Document_Transactions WHERE user_id = ? AND document_id = ?',
      [userId, document_id]
    );

    if (existingTransaction.length > 0) {
      return res.status(400).json({ message: 'Bạn đã mua tài liệu này' });
    }

    // Lấy thông tin tài liệu
    const [document] = await db.execute(
      'SELECT * FROM Documents WHERE document_id = ?',
      [document_id]
    );

    if (document.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài liệu' });
    }

    // Thêm giao dịch mới
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

const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Lấy danh sách tất cả tài liệu
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, c.category_name
      FROM Documents d
      LEFT JOIN Document_Categories c ON d.category_id = c.category_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài liệu:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách tài liệu' });
  }
});

// Lấy danh sách tài liệu theo danh mục
router.get('/category/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const [rows] = await pool.query(
      'SELECT * FROM Documents WHERE category_id = ?',
      [categoryId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu theo danh mục:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy tài liệu theo danh mục' });
  }
});

// Lấy tài liệu đã mua của người dùng
router.get('/purchased/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.query(`
      SELECT d.*, c.category_name, dt.transaction_date as purchase_date
      FROM Documents d
      JOIN Document_Transactions dt ON d.document_id = dt.document_id
      LEFT JOIN Document_Categories c ON d.category_id = c.category_id
      WHERE dt.user_id = ?
    `, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy tài liệu đã mua:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy tài liệu đã mua' });
  }
});

// Thêm các routes khác...

module.exports = router;

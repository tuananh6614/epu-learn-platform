
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trong thực tế, bạn nên mã hóa mật khẩu và so sánh hash
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    const user = users[0];
    
    // Không trả về mật khẩu
    delete user.password;
    
    res.json({
      message: 'Đăng nhập thành công',
      user
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const [existingUsers] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Thêm người dùng mới
    const [result] = await pool.query(
      'INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [full_name, email, password, 'user']
    );
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      user_id: result.insertId,
      full_name,
      email,
      role: 'user'
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
  }
});

// Lấy thông tin người dùng
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [users] = await pool.query(
      'SELECT user_id, full_name, email, role, created_at FROM Users WHERE user_id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
  }
});

module.exports = router;

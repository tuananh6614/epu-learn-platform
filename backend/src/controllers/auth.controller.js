const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // Log chi tiết request
    console.log('=== BẮT ĐẦU ĐĂNG KÝ ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
      console.log('Thiếu thông tin đăng ký:', { full_name, email, password: password ? 'provided' : 'missing' });
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    // Test kết nối database trực tiếp
    try {
      console.log('Kiểm tra kết nối database...');
      await db.execute('SELECT 1');
      console.log('Kết nối database OK');
    } catch (dbError) {
      console.error('Lỗi kết nối database:', dbError);
      throw new Error('Không thể kết nối database');
    }

    // Kiểm tra email đã tồn tại
    console.log('Thực thi query kiểm tra email:', email);
    const [existingUsers] = await db.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    console.log('Kết quả kiểm tra email:', existingUsers);

    if (existingUsers.length > 0) {
      console.log('Email đã tồn tại:', email);
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    console.log('Đang mã hóa mật khẩu...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Mã hóa mật khẩu thành công');

    // In ra câu lệnh SQL để debug
    const insertQuery = 'INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)';
    const insertValues = [full_name, email, hashedPassword, 'user'];
    console.log('Query sẽ thực thi:', insertQuery);
    console.log('Giá trị:', insertValues.map(v => typeof v === 'string' ? v : '[hidden]'));

    // Thêm user mới
    console.log('Đang thực hiện insert...');
    const [result] = await db.execute(insertQuery, insertValues);
    console.log('Kết quả insert:', JSON.stringify(result, null, 2));

    if (result.affectedRows > 0) {
      // Kiểm tra user vừa tạo
      console.log('Đang lấy thông tin user mới...');
      const [newUser] = await db.execute(
        'SELECT user_id, full_name, email, role FROM Users WHERE user_id = ?',
        [result.insertId]
      );
      console.log('Thông tin user mới:', newUser[0]);

      res.status(201).json({
        message: 'Đăng ký thành công',
        user: newUser[0]
      });
    } else {
      console.error('Không có rows bị ảnh hưởng sau khi insert');
      throw new Error('Không thể tạo tài khoản');
    }
    console.log('=== KẾT THÚC ĐĂNG KÝ ===');
  } catch (error) {
    console.error('=== LỖI ĐĂNG KÝ ===');
    console.error('Chi tiết lỗi:', {
      message: error.message,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 
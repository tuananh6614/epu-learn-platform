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

exports.updateProfile = async (req, res) => {
  try {
    console.log('=== BẮT ĐẦU CẬP NHẬT HỒ SƠ ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('User ID:', req.user.userId);
    
    const { fullName, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Kiểm tra xem user có tồn tại
    const [users] = await db.execute(
      'SELECT * FROM Users WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      console.log('Không tìm thấy user với ID:', userId);
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const user = users[0];
    console.log('Tìm thấy user:', { id: user.user_id, email: user.email });

    // Mảng chứa các trường cần cập nhật và giá trị tương ứng
    const updateFields = [];
    const updateValues = [];

    // Nếu có fullName, thêm vào danh sách cập nhật
    if (fullName && fullName !== user.full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(fullName);
      console.log('Cập nhật họ tên:', fullName);
    }

    // Nếu có mật khẩu mới và mật khẩu hiện tại
    if (newPassword && currentPassword) {
      // Xác thực mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        console.log('Mật khẩu hiện tại không chính xác');
        return res.status(401).json({ message: 'Mật khẩu hiện tại không chính xác' });
      }
      
      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
      console.log('Cập nhật mật khẩu mới');
    }

    // Nếu không có trường nào cần cập nhật
    if (updateFields.length === 0) {
      console.log('Không có trường nào cần cập nhật');
      return res.status(400).json({ message: 'Không có thông tin nào được cập nhật' });
    }

    // Thực hiện cập nhật trong database
    const updateQuery = `UPDATE Users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    updateValues.push(userId);
    
    console.log('Query cập nhật:', updateQuery);
    console.log('Giá trị cập nh��t:', updateValues.map((v, i) => 
      i < updateValues.length - 1 && updateFields[i].includes('password') ? '[hidden]' : v
    ));
    
    const [result] = await db.execute(updateQuery, updateValues);
    
    if (result.affectedRows > 0) {
      // Lấy thông tin user đã cập nhật
      const [updatedUser] = await db.execute(
        'SELECT user_id, full_name, email, role FROM Users WHERE user_id = ?',
        [userId]
      );
      
      console.log('Cập nhật thành công. User mới:', updatedUser[0]);
      
      res.json({
        message: 'Cập nhật thông tin thành công',
        user: {
          id: updatedUser[0].user_id,
          fullName: updatedUser[0].full_name,
          email: updatedUser[0].email,
          role: updatedUser[0].role
        }
      });
    } else {
      console.log('Không có thay đổi nào được áp dụng');
      res.status(400).json({ message: 'Không có thay đổi nào được áp dụng' });
    }
    
    console.log('=== KẾT THÚC CẬP NHẬT HỒ SƠ ===');
  } catch (error) {
    console.error('=== LỖI CẬP NHẬT HỒ SƠ ===');
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


const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, fullName, email, role, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the requester is an admin or the user themselves
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Không có quyền truy cập thông tin người dùng này' });
    }
    
    const [users] = await db.query(
      'SELECT id, fullName, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
  }
};

// Create new user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }
    
    // Check if email already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (fullName, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [fullName, email, hashedPassword, role || 'user']
    );
    
    res.status(201).json({
      id: result.insertId,
      fullName,
      email,
      role: role || 'user'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Lỗi khi tạo người dùng mới' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role } = req.body;
    
    // Check if the requester is an admin or the user themselves
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Không có quyền chỉnh sửa thông tin người dùng này' });
    }
    
    // Only admin can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ quản trị viên mới có thể thay đổi vai trò' });
    }
    
    // Get current user data
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Check if email is being changed and is already used
    if (email && email !== users[0].email) {
      const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
    }
    
    // Build update query
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    const updateFields = [];
    
    if (fullName) {
      updateFields.push('fullName = ?');
      updateValues.push(fullName);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    if (password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    
    if (role && req.user.role === 'admin') {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào được cập nhật' });
    }
    
    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateValues.push(id);
    
    await db.query(updateQuery, updateValues);
    
    // Return updated user
    const [updatedUsers] = await db.query(
      'SELECT id, fullName, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
};

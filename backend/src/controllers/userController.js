const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, fullname, phone, role } = req.body;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Cập nhật thông tin người dùng
    const updated = await User.updateUser(userId, {
      username,
      email,
      fullname,
      phone,
      role
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Cập nhật không thành công' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật thông tin người dùng thành công',
      user: { id: userId, username, email, fullname, phone, role }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Xóa người dùng
    const deleted = await User.deleteUser(userId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Xóa không thành công' });
    }
    
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, fullname, phone } = req.body;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Cập nhật thông tin người dùng
    const updated = await User.updateUser(userId, {
      username,
      email: user.email, // Giữ nguyên email
      fullname,
      phone,
      role: user.role // Giữ nguyên role
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Cập nhật không thành công' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật thông tin cá nhân thành công',
      user: { 
        id: userId, 
        username, 
        email: user.email, 
        fullname, 
        phone, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile
}; 
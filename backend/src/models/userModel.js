const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    try {
      const [rows] = await db.query('SELECT user_id, full_name, email, role, created_at FROM Users WHERE user_id = ?', [userId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async register(userData) {
    const { full_name, email, password, role = 'user' } = userData;
    try {
      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const [result] = await db.query(
        'INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [full_name, email, hashedPassword, role]
      );
      
      return { user_id: result.insertId, full_name, email, role };
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const [rows] = await db.query('SELECT user_id, full_name, email, role, created_at FROM Users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    const { full_name, email, role } = userData;
    try {
      const [result] = await db.query(
        'UPDATE Users SET full_name = ?, email = ?, role = ? WHERE user_id = ?',
        [full_name, email, role, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(userId, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const [result] = await db.query(
        'UPDATE Users SET password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 
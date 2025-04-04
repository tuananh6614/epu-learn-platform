const db = require('../config/db');

class Major {
  static async getAllMajors() {
    try {
      const [rows] = await db.query('SELECT * FROM Majors ORDER BY major_name ASC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMajorById(majorId) {
    try {
      const [rows] = await db.query('SELECT * FROM Majors WHERE major_id = ?', [majorId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createMajor(majorData) {
    const { major_name, description } = majorData;
    try {
      const [result] = await db.query(
        'INSERT INTO Majors (major_name, description) VALUES (?, ?)',
        [major_name, description]
      );
      
      return { major_id: result.insertId, ...majorData };
    } catch (error) {
      throw error;
    }
  }

  static async updateMajor(majorId, majorData) {
    const { major_name, description } = majorData;
    try {
      const [result] = await db.query(
        'UPDATE Majors SET major_name = ?, description = ? WHERE major_id = ?',
        [major_name, description, majorId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMajor(majorId) {
    try {
      const [result] = await db.query('DELETE FROM Majors WHERE major_id = ?', [majorId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getCourseCountByMajor() {
    try {
      const [rows] = await db.query(`
        SELECT m.*, COUNT(c.course_id) as course_count
        FROM Majors m
        LEFT JOIN Courses c ON m.major_id = c.major_id
        GROUP BY m.major_id
        ORDER BY m.major_name ASC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Major; 
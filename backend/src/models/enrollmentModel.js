const db = require('../config/db');

class Enrollment {
  static async enrollCourse(userId, courseId) {
    try {
      // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
      const [existingEnrollment] = await db.query(
        'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );
      
      if (existingEnrollment.length > 0) {
        throw new Error('Người dùng đã đăng ký khóa học này');
      }
      
      const [result] = await db.query(
        'INSERT INTO Enrollments (user_id, course_id, progress_percent) VALUES (?, ?, 0)',
        [userId, courseId]
      );
      
      return { enrollment_id: result.insertId, user_id: userId, course_id: courseId, progress_percent: 0 };
    } catch (error) {
      throw error;
    }
  }

  static async unenrollCourse(userId, courseId) {
    try {
      const [result] = await db.query(
        'DELETE FROM Enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getEnrollment(userId, courseId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
      );
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getEnrollmentsByUserId(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Enrollments WHERE user_id = ? ORDER BY enrolled_date DESC',
        [userId]
      );
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getEnrollmentsByCourseId(courseId) {
    try {
      const [rows] = await db.query(`
        SELECT e.*, u.full_name, u.email
        FROM Enrollments e
        JOIN Users u ON e.user_id = u.user_id
        WHERE e.course_id = ?
        ORDER BY e.enrolled_date DESC
      `, [courseId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateProgress(userId, courseId, lessonId, progressPercent) {
    try {
      const [result] = await db.query(
        'UPDATE Enrollments SET current_lesson_id = ?, progress_percent = ? WHERE user_id = ? AND course_id = ?',
        [lessonId, progressPercent, userId, courseId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Enrollment; 
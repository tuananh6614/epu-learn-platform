const db = require('../config/db');

class Course {
  static async getAllCourses() {
    try {
      const [rows] = await db.query(`
        SELECT c.*, m.major_name
        FROM Courses c
        LEFT JOIN Majors m ON c.major_id = m.major_id
        ORDER BY c.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCourseById(courseId) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, m.major_name
        FROM Courses c
        LEFT JOIN Majors m ON c.major_id = m.major_id
        WHERE c.course_id = ?
      `, [courseId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getCoursesByMajorId(majorId) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, m.major_name
        FROM Courses c
        LEFT JOIN Majors m ON c.major_id = m.major_id
        WHERE c.major_id = ?
        ORDER BY c.created_at DESC
      `, [majorId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async createCourse(courseData) {
    const { title, description, thumbnail, major_id } = courseData;
    try {
      const [result] = await db.query(
        'INSERT INTO Courses (title, description, thumbnail, major_id) VALUES (?, ?, ?, ?)',
        [title, description, thumbnail, major_id]
      );
      
      return { course_id: result.insertId, ...courseData };
    } catch (error) {
      throw error;
    }
  }

  static async updateCourse(courseId, courseData) {
    const { title, description, thumbnail, major_id } = courseData;
    try {
      const [result] = await db.query(
        'UPDATE Courses SET title = ?, description = ?, thumbnail = ?, major_id = ? WHERE course_id = ?',
        [title, description, thumbnail, major_id, courseId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCourse(courseId) {
    try {
      const [result] = await db.query('DELETE FROM Courses WHERE course_id = ?', [courseId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách khóa học mà học viên đã đăng ký
  static async getEnrolledCourses(userId) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, e.enrolled_date, e.progress_percent
        FROM Courses c
        JOIN Enrollments e ON c.course_id = e.course_id
        WHERE e.user_id = ?
        ORDER BY e.enrolled_date DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Course; 
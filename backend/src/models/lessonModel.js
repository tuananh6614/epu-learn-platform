const db = require('../config/db');

class Lesson {
  static async getLessonsByChapterId(chapterId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Lessons
        WHERE chapter_id = ?
        ORDER BY lesson_order ASC
      `, [chapterId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getLessonById(lessonId) {
    try {
      const [rows] = await db.query('SELECT * FROM Lessons WHERE lesson_id = ?', [lessonId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createLesson(lessonData) {
    const { chapter_id, title, content, lesson_order } = lessonData;
    try {
      const [result] = await db.query(
        'INSERT INTO Lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)',
        [chapter_id, title, content, lesson_order]
      );
      
      return { lesson_id: result.insertId, ...lessonData };
    } catch (error) {
      throw error;
    }
  }

  static async updateLesson(lessonId, lessonData) {
    const { title, content, lesson_order } = lessonData;
    try {
      const [result] = await db.query(
        'UPDATE Lessons SET title = ?, content = ?, lesson_order = ? WHERE lesson_id = ?',
        [title, content, lesson_order, lessonId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteLesson(lessonId) {
    try {
      const [result] = await db.query('DELETE FROM Lessons WHERE lesson_id = ?', [lessonId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getNextLessonOrder(chapterId) {
    try {
      const [rows] = await db.query(
        'SELECT MAX(lesson_order) as maxOrder FROM Lessons WHERE chapter_id = ?', 
        [chapterId]
      );
      
      return (rows[0]?.maxOrder || 0) + 1;
    } catch (error) {
      throw error;
    }
  }

  static async getAllLessonsByCourseId(courseId) {
    try {
      const [rows] = await db.query(`
        SELECT l.* 
        FROM Lessons l
        INNER JOIN Chapters c ON l.chapter_id = c.chapter_id
        WHERE c.course_id = ?
        ORDER BY c.chapter_order ASC, l.lesson_order ASC
      `, [courseId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Lesson; 
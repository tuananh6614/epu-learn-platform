const db = require('../config/db');

class Chapter {
  static async getChaptersByCourseId(courseId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Chapters
        WHERE course_id = ?
        ORDER BY chapter_order ASC
      `, [courseId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getChapterById(chapterId) {
    try {
      const [rows] = await db.query('SELECT * FROM Chapters WHERE chapter_id = ?', [chapterId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createChapter(chapterData) {
    const { course_id, title, description, chapter_order } = chapterData;
    try {
      const [result] = await db.query(
        'INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)',
        [course_id, title, description, chapter_order]
      );
      
      return { chapter_id: result.insertId, ...chapterData };
    } catch (error) {
      throw error;
    }
  }

  static async updateChapter(chapterId, chapterData) {
    const { title, description, chapter_order } = chapterData;
    try {
      const [result] = await db.query(
        'UPDATE Chapters SET title = ?, description = ?, chapter_order = ? WHERE chapter_id = ?',
        [title, description, chapter_order, chapterId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteChapter(chapterId) {
    try {
      const [result] = await db.query('DELETE FROM Chapters WHERE chapter_id = ?', [chapterId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getNextChapterOrder(courseId) {
    try {
      const [rows] = await db.query(
        'SELECT MAX(chapter_order) as maxOrder FROM Chapters WHERE course_id = ?', 
        [courseId]
      );
      
      return (rows[0]?.maxOrder || 0) + 1;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chapter; 
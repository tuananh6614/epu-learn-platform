const db = require('../config/db');

class Page {
  static async getPagesByLessonId(lessonId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Pages
        WHERE lesson_id = ?
        ORDER BY page_number ASC
      `, [lessonId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPageById(pageId) {
    try {
      const [rows] = await db.query('SELECT * FROM Pages WHERE page_id = ?', [pageId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createPage(pageData) {
    const { lesson_id, page_number, content } = pageData;
    try {
      const [result] = await db.query(
        'INSERT INTO Pages (lesson_id, page_number, content) VALUES (?, ?, ?)',
        [lesson_id, page_number, content]
      );
      
      return { page_id: result.insertId, ...pageData };
    } catch (error) {
      throw error;
    }
  }

  static async updatePage(pageId, pageData) {
    const { page_number, content } = pageData;
    try {
      const [result] = await db.query(
        'UPDATE Pages SET page_number = ?, content = ? WHERE page_id = ?',
        [page_number, content, pageId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deletePage(pageId) {
    try {
      const [result] = await db.query('DELETE FROM Pages WHERE page_id = ?', [pageId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getNextPageNumber(lessonId) {
    try {
      const [rows] = await db.query(
        'SELECT MAX(page_number) as maxPage FROM Pages WHERE lesson_id = ?', 
        [lessonId]
      );
      
      return (rows[0]?.maxPage || 0) + 1;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Page; 
const db = require('../config/db');

class DocumentCategory {
  static async getAllCategories() {
    try {
      const [rows] = await db.query('SELECT * FROM Document_Categories ORDER BY category_name ASC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const [rows] = await db.query('SELECT * FROM Document_Categories WHERE category_id = ?', [categoryId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createCategory(categoryData) {
    const { category_name, description } = categoryData;
    try {
      const [result] = await db.query(
        'INSERT INTO Document_Categories (category_name, description) VALUES (?, ?)',
        [category_name, description]
      );
      
      return { category_id: result.insertId, ...categoryData };
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(categoryId, categoryData) {
    const { category_name, description } = categoryData;
    try {
      const [result] = await db.query(
        'UPDATE Document_Categories SET category_name = ?, description = ? WHERE category_id = ?',
        [category_name, description, categoryId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCategory(categoryId) {
    try {
      const [result] = await db.query('DELETE FROM Document_Categories WHERE category_id = ?', [categoryId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getCategoriesWithDocumentCount() {
    try {
      const [rows] = await db.query(`
        SELECT dc.*, COUNT(d.document_id) as document_count
        FROM Document_Categories dc
        LEFT JOIN Documents d ON dc.category_id = d.category_id
        GROUP BY dc.category_id
        ORDER BY dc.category_name ASC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DocumentCategory; 
const db = require('../config/db');

class Document {
  static async getAllDocuments() {
    try {
      const [rows] = await db.query(`
        SELECT d.*, c.category_name
        FROM Documents d
        LEFT JOIN Document_Categories c ON d.category_id = c.category_id
        ORDER BY d.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getDocumentById(documentId) {
    try {
      const [rows] = await db.query(`
        SELECT d.*, c.category_name
        FROM Documents d
        LEFT JOIN Document_Categories c ON d.category_id = c.category_id
        WHERE d.document_id = ?
      `, [documentId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getDocumentsByCategory(categoryId) {
    try {
      const [rows] = await db.query(`
        SELECT d.*, c.category_name
        FROM Documents d
        LEFT JOIN Document_Categories c ON d.category_id = c.category_id
        WHERE d.category_id = ?
        ORDER BY d.created_at DESC
      `, [categoryId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async createDocument(documentData) {
    const { title, description, file_path, preview_url, price, category_id } = documentData;
    try {
      const [result] = await db.query(
        'INSERT INTO Documents (title, description, file_path, preview_url, price, category_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, file_path, preview_url, price, category_id]
      );
      
      return { document_id: result.insertId, ...documentData };
    } catch (error) {
      throw error;
    }
  }

  static async updateDocument(documentId, documentData) {
    const { title, description, file_path, preview_url, price, category_id } = documentData;
    try {
      const [result] = await db.query(
        'UPDATE Documents SET title = ?, description = ?, file_path = ?, preview_url = ?, price = ?, category_id = ? WHERE document_id = ?',
        [title, description, file_path, preview_url, price, category_id, documentId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteDocument(documentId) {
    try {
      const [result] = await db.query('DELETE FROM Documents WHERE document_id = ?', [documentId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getUserPurchasedDocuments(userId) {
    try {
      const [rows] = await db.query(`
        SELECT d.*, c.category_name, dt.transaction_date
        FROM Documents d
        JOIN Document_Transactions dt ON d.document_id = dt.document_id
        LEFT JOIN Document_Categories c ON d.category_id = c.category_id
        WHERE dt.user_id = ?
        ORDER BY dt.transaction_date DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async checkDocumentPurchase(userId, documentId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Document_Transactions 
        WHERE user_id = ? AND document_id = ?
      `, [userId, documentId]);
      
      return rows.length > 0; // Trả về true nếu người dùng đã mua tài liệu
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Document; 
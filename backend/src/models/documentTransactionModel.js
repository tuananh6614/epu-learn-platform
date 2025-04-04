const db = require('../config/db');

class DocumentTransaction {
  static async createTransaction(transactionData) {
    const { user_id, document_id, amount, payment_method, details } = transactionData;
    try {
      // Kiểm tra xem người dùng đã mua tài liệu này chưa
      const [existingTransaction] = await db.query(
        'SELECT * FROM Document_Transactions WHERE user_id = ? AND document_id = ?',
        [user_id, document_id]
      );
      
      if (existingTransaction.length > 0) {
        throw new Error('Người dùng đã mua tài liệu này trước đó');
      }
      
      const [result] = await db.query(
        'INSERT INTO Document_Transactions (user_id, document_id, amount, payment_method, details) VALUES (?, ?, ?, ?, ?)',
        [user_id, document_id, amount, payment_method, details]
      );
      
      return { transaction_id: result.insertId, ...transactionData, transaction_date: new Date() };
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT dt.*, d.title as document_title
        FROM Document_Transactions dt
        JOIN Documents d ON dt.document_id = d.document_id
        WHERE dt.user_id = ?
        ORDER BY dt.transaction_date DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByDocumentId(documentId) {
    try {
      const [rows] = await db.query(`
        SELECT dt.*, u.full_name
        FROM Document_Transactions dt
        JOIN Users u ON dt.user_id = u.user_id
        WHERE dt.document_id = ?
        ORDER BY dt.transaction_date DESC
      `, [documentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionById(transactionId) {
    try {
      const [rows] = await db.query(`
        SELECT dt.*, d.title as document_title, u.full_name
        FROM Document_Transactions dt
        JOIN Documents d ON dt.document_id = d.document_id
        JOIN Users u ON dt.user_id = u.user_id
        WHERE dt.transaction_id = ?
      `, [transactionId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllTransactions() {
    try {
      const [rows] = await db.query(`
        SELECT dt.*, d.title as document_title, u.full_name
        FROM Document_Transactions dt
        JOIN Documents d ON dt.document_id = d.document_id
        JOIN Users u ON dt.user_id = u.user_id
        ORDER BY dt.transaction_date DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DocumentTransaction; 
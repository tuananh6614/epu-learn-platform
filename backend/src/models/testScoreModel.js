const db = require('../config/db');

class TestScore {
  static async getScoresByUserId(userId) {
    try {
      const [rows] = await db.query(`
        SELECT ts.*, e.title as exam_title, e.course_id, e.chapter_id,
               c.title as course_title
        FROM Test_Scores ts
        JOIN Exams e ON ts.exam_id = e.exam_id
        JOIN Courses c ON e.course_id = c.course_id
        WHERE ts.user_id = ?
        ORDER BY ts.attempt_date DESC
      `, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getScoresByExamId(examId) {
    try {
      const [rows] = await db.query(`
        SELECT ts.*, u.full_name
        FROM Test_Scores ts
        JOIN Users u ON ts.user_id = u.user_id
        WHERE ts.exam_id = ?
        ORDER BY ts.attempt_date DESC
      `, [examId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getUserExamScore(userId, examId) {
    try {
      const [rows] = await db.query(`
        SELECT * 
        FROM Test_Scores
        WHERE user_id = ? AND exam_id = ?
        ORDER BY attempt_date DESC
      `, [userId, examId]);
      
      return rows[0]; // Trả về kết quả mới nhất
    } catch (error) {
      throw error;
    }
  }

  static async createScore(scoreData) {
    const { user_id, exam_id, score, status } = scoreData;
    try {
      const [result] = await db.query(
        'INSERT INTO Test_Scores (user_id, exam_id, score, status) VALUES (?, ?, ?, ?)',
        [user_id, exam_id, score, status]
      );
      
      return { score_id: result.insertId, ...scoreData, attempt_date: new Date() };
    } catch (error) {
      throw error;
    }
  }

  static async getExamStats(examId) {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_attempts,
          AVG(score) as average_score,
          COUNT(CASE WHEN status = 'pass' THEN 1 END) as pass_count,
          COUNT(CASE WHEN status = 'fail' THEN 1 END) as fail_count
        FROM Test_Scores
        WHERE exam_id = ?
      `, [examId]);
      
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TestScore; 
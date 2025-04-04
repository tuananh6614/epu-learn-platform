const db = require('../config/db');

class Question {
  static async getQuestionsByExamId(examId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Questions
        WHERE exam_id = ?
        ORDER BY question_id ASC
      `, [examId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getQuestionById(questionId) {
    try {
      const [rows] = await db.query('SELECT * FROM Questions WHERE question_id = ?', [questionId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createQuestion(questionData) {
    const { exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = questionData;
    try {
      const [result] = await db.query(
        'INSERT INTO Questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer]
      );
      
      return { question_id: result.insertId, ...questionData };
    } catch (error) {
      throw error;
    }
  }

  static async updateQuestion(questionId, questionData) {
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = questionData;
    try {
      const [result] = await db.query(
        'UPDATE Questions SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? WHERE question_id = ?',
        [question_text, option_a, option_b, option_c, option_d, correct_answer, questionId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteQuestion(questionId) {
    try {
      const [result] = await db.query('DELETE FROM Questions WHERE question_id = ?', [questionId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async bulkCreateQuestions(examId, questions) {
    try {
      const values = questions.map(q => [
        examId,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c, 
        q.option_d,
        q.correct_answer
      ]);
      
      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();
      
      const [result] = await db.query(
        `INSERT INTO Questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES ${placeholders}`,
        flatValues
      );
      
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Question; 
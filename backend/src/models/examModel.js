const db = require('../config/db');

class Exam {
  static async getExamsByCourseId(courseId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Exams
        WHERE course_id = ? AND chapter_id IS NULL
        ORDER BY exam_id ASC
      `, [courseId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getExamsByChapterId(chapterId) {
    try {
      const [rows] = await db.query(`
        SELECT * FROM Exams
        WHERE chapter_id = ?
        ORDER BY exam_id ASC
      `, [chapterId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getExamById(examId) {
    try {
      const [rows] = await db.query('SELECT * FROM Exams WHERE exam_id = ?', [examId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createExam(examData) {
    const { course_id, chapter_id, title, time_limit, total_questions, passing_score } = examData;
    try {
      const [result] = await db.query(
        'INSERT INTO Exams (course_id, chapter_id, title, time_limit, total_questions, passing_score) VALUES (?, ?, ?, ?, ?, ?)',
        [course_id, chapter_id, title, time_limit, total_questions, passing_score]
      );
      
      return { exam_id: result.insertId, ...examData };
    } catch (error) {
      throw error;
    }
  }

  static async updateExam(examId, examData) {
    const { title, time_limit, total_questions, passing_score } = examData;
    try {
      const [result] = await db.query(
        'UPDATE Exams SET title = ?, time_limit = ?, total_questions = ?, passing_score = ? WHERE exam_id = ?',
        [title, time_limit, total_questions, passing_score, examId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExam(examId) {
    try {
      const [result] = await db.query('DELETE FROM Exams WHERE exam_id = ?', [examId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getExamWithQuestions(examId) {
    try {
      const [exam] = await db.query(`
        SELECT * FROM Exams WHERE exam_id = ?
      `, [examId]);
      
      if (exam.length === 0) {
        return null;
      }
      
      const [questions] = await db.query(`
        SELECT * FROM Questions WHERE exam_id = ?
      `, [examId]);
      
      return {
        ...exam[0],
        questions
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Exam; 
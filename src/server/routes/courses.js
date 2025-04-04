
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Lấy danh sách tất cả khóa học
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, m.major_name 
      FROM Courses c
      LEFT JOIN Majors m ON c.major_id = m.major_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách khóa học' });
  }
});

// Lấy thông tin chi tiết một khóa học
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Lấy thông tin khóa học
    const [courseRows] = await pool.query('SELECT * FROM Courses WHERE course_id = ?', [courseId]);
    
    if (courseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const course = courseRows[0];
    
    // Lấy danh sách các chương của khóa học
    const [chaptersRows] = await pool.query(
      'SELECT * FROM Chapters WHERE course_id = ? ORDER BY chapter_order',
      [courseId]
    );
    
    // Gắn thông tin chương vào khóa học
    course.chapters = chaptersRows;
    
    res.json(course);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết khóa học:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết khóa học' });
  }
});

// Thêm các routes khác cho việc thêm, sửa, xóa khóa học...

module.exports = router;

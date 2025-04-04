const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Lấy danh sách bài học theo khóa học
router.get('/course/:courseId', verifyToken, lessonController.getLessonsByCourseId);

// Lấy chi tiết bài học
router.get('/:id', verifyToken, lessonController.getLessonById);

// Thêm bài học mới (chỉ dành cho giáo viên và admin)
router.post('/course/:courseId', verifyToken, checkRole(['teacher', 'admin']), lessonController.createLesson);

// Cập nhật bài học (chỉ dành cho giáo viên và admin)
router.put('/:id', verifyToken, checkRole(['teacher', 'admin']), lessonController.updateLesson);

// Xóa bài học (chỉ dành cho giáo viên và admin)
router.delete('/:id', verifyToken, checkRole(['teacher', 'admin']), lessonController.deleteLesson);

module.exports = router; 
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyToken } = require('../middleware/auth');

// Đăng ký khóa học
router.post('/', verifyToken, enrollmentController.enrollCourse);

// Hủy đăng ký khóa học
router.delete('/:courseId', verifyToken, enrollmentController.unenrollCourse);

// Lấy danh sách khóa học đã đăng ký
router.get('/', verifyToken, enrollmentController.getEnrolledCourses);

// Kiểm tra xem đã đăng ký khóa học chưa
router.get('/check/:courseId', verifyToken, enrollmentController.checkEnrollment);

module.exports = router; 
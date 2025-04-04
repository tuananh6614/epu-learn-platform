const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Routes công khai
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Routes cho giáo viên
router.get('/teacher/courses', verifyToken, checkRole(['teacher', 'admin']), courseController.getTeacherCourses);
router.post('/', verifyToken, checkRole(['teacher', 'admin']), courseController.createCourse);
router.put('/:id', verifyToken, checkRole(['teacher', 'admin']), courseController.updateCourse);
router.delete('/:id', verifyToken, checkRole(['teacher', 'admin']), courseController.deleteCourse);
router.get('/:id/students', verifyToken, checkRole(['teacher', 'admin']), courseController.getEnrolledStudents);

// Routes cho học viên
router.get('/student/enrolled', verifyToken, courseController.getStudentCourses);

module.exports = router; 
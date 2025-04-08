
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const courseController = require('../controllers/course.controller');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/lesson/:lessonId', courseController.getLessonContent);
router.get('/exam/:examId', courseController.getExamWithQuestions);

// Protected routes (require authentication)
router.get('/user/:userId', verifyToken, courseController.getUserCourses);
router.get('/progress/:userId/:courseId', verifyToken, courseController.getUserCourseProgress);
router.post('/enroll', verifyToken, courseController.enrollCourse);
router.post('/progress', verifyToken, courseController.updateProgress);
router.post('/exam/submit', verifyToken, courseController.submitExamResult);

// Admin routes
router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);
router.post('/chapter', verifyToken, isAdmin, courseController.addChapter);
router.post('/lesson', verifyToken, isAdmin, courseController.addLesson);
router.post('/page', verifyToken, isAdmin, courseController.updateLessonPage);
router.post('/exam', verifyToken, isAdmin, courseController.createExam);
router.post('/question', verifyToken, isAdmin, courseController.addQuestion);

module.exports = router;

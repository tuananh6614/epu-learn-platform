const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

const enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem học viên đã đăng ký khóa học này chưa
    const existingEnrollment = await Enrollment.getEnrollment(studentId, courseId);
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này' });
    }
    
    // Đăng ký khóa học
    const enrollment = await Enrollment.enrollCourse(studentId, courseId);
    
    res.status(201).json({
      message: 'Đăng ký khóa học thành công',
      enrollment
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

const unenrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem học viên đã đăng ký khóa học này chưa
    const existingEnrollment = await Enrollment.getEnrollment(studentId, courseId);
    if (!existingEnrollment) {
      return res.status(404).json({ message: 'Bạn chưa đăng ký khóa học này' });
    }
    
    // Hủy đăng ký khóa học
    const result = await Enrollment.unenrollCourse(studentId, courseId);
    if (!result) {
      return res.status(400).json({ message: 'Hủy đăng ký không thành công' });
    }
    
    res.status(200).json({ message: 'Hủy đăng ký khóa học thành công' });
  } catch (error) {
    console.error('Unenroll course error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Lấy danh sách khóa học đã đăng ký
    const courses = await Course.getEnrolledCourses(studentId);
    
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const checkEnrollment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId;
    
    // Kiểm tra xem học viên đã đăng ký khóa học này chưa
    const enrollment = await Enrollment.getEnrollment(studentId, courseId);
    
    res.status(200).json({ 
      enrolled: !!enrollment,
      enrollment
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  enrollCourse,
  unenrollCourse,
  getEnrolledCourses,
  checkEnrollment
}; 
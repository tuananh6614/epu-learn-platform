const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    res.status(200).json({ course });
  } catch (error) {
    console.error('Get course by id error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const courses = await Course.getCoursesByTeacherId(teacherId);
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, price, image_url, category } = req.body;
    
    const newCourse = await Course.createCourse({
      title,
      description,
      price,
      image_url,
      category,
      teacher_id: teacherId
    });
    
    res.status(201).json({
      message: 'Tạo khóa học thành công',
      course: newCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user.id;
    const { title, description, price, image_url, category } = req.body;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền cập nhật khóa học này' });
    }
    
    // Cập nhật khóa học
    const updated = await Course.updateCourse(courseId, {
      title,
      description,
      price,
      image_url,
      category,
      teacher_id: course.teacher_id // Giữ nguyên giáo viên
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Cập nhật không thành công' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật khóa học thành công',
      course: { 
        id: courseId, 
        title, 
        description, 
        price, 
        image_url, 
        category, 
        teacher_id: course.teacher_id 
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user.id;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa khóa học này' });
    }
    
    // Xóa khóa học
    const deleted = await Course.deleteCourse(courseId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Xóa không thành công' });
    }
    
    res.status(200).json({ message: 'Xóa khóa học thành công' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user.id;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xem danh sách học viên của khóa học này' });
    }
    
    // Lấy danh sách học viên đã đăng ký
    const enrollments = await Enrollment.getEnrollmentsByCourseId(courseId);
    
    res.status(200).json({ enrollments });
  } catch (error) {
    console.error('Get enrolled students error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Lấy danh sách khóa học đã đăng ký
    const courses = await Course.getEnrolledCourses(studentId);
    
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getTeacherCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getEnrolledStudents,
  getStudentCourses
}; 
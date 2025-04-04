const Lesson = require('../models/lessonModel');
const Course = require('../models/courseModel');

const getLessonsByCourseId = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const lessons = await Lesson.getLessonsByCourseId(courseId);
    res.status(200).json({ lessons });
  } catch (error) {
    console.error('Get lessons by course id error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    
    const lesson = await Lesson.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }
    
    res.status(200).json({ lesson });
  } catch (error) {
    console.error('Get lesson by id error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const createLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, content, video_url } = req.body;
    const teacherId = req.user.id;
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền thêm bài học vào khóa học này' });
    }
    
    // Lấy số thứ tự tiếp theo
    const orderNumber = await Lesson.getNextOrderNumber(courseId);
    
    // Tạo bài học mới
    const newLesson = await Lesson.createLesson({
      title,
      content,
      video_url,
      course_id: courseId,
      order_number: orderNumber
    });
    
    res.status(201).json({
      message: 'Tạo bài học thành công',
      lesson: newLesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, content, video_url, order_number } = req.body;
    const teacherId = req.user.id;
    
    // Kiểm tra xem bài học có tồn tại không
    const lesson = await Lesson.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(lesson.course_id);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền cập nhật bài học này' });
    }
    
    // Cập nhật bài học
    const updated = await Lesson.updateLesson(lessonId, {
      title,
      content,
      video_url,
      order_number: order_number || lesson.order_number
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Cập nhật không thành công' });
    }
    
    res.status(200).json({ 
      message: 'Cập nhật bài học thành công',
      lesson: { 
        id: lessonId, 
        title, 
        content, 
        video_url, 
        course_id: lesson.course_id,
        order_number: order_number || lesson.order_number
      }
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const teacherId = req.user.id;
    
    // Kiểm tra xem bài học có tồn tại không
    const lesson = await Lesson.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }
    
    // Kiểm tra xem khóa học có tồn tại không
    const course = await Course.getCourseById(lesson.course_id);
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Kiểm tra xem người dùng có phải là giáo viên của khóa học này không
    if (course.teacher_id !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa bài học này' });
    }
    
    // Xóa bài học
    const deleted = await Lesson.deleteLesson(lessonId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Xóa không thành công' });
    }
    
    res.status(200).json({ message: 'Xóa bài học thành công' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getLessonsByCourseId,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
}; 
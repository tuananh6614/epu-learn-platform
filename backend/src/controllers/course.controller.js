const db = require('../config/db');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, m.major_name 
      FROM Courses c
      LEFT JOIN Majors m ON c.major_id = m.major_id
      ORDER BY c.created_at DESC
    `);
    
    res.json(courses);
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học' });
  }
};

// Get course by id with chapters and lessons
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get course details
    const [courses] = await db.execute(`
      SELECT c.*, m.major_name 
      FROM Courses c
      LEFT JOIN Majors m ON c.major_id = m.major_id
      WHERE c.course_id = ?
    `, [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    const course = courses[0];
    
    // Get chapters
    const [chapters] = await db.execute(`
      SELECT * FROM Chapters 
      WHERE course_id = ? 
      ORDER BY chapter_order ASC
    `, [id]);
    
    // Get lessons for each chapter
    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const [lessons] = await db.execute(`
          SELECT * FROM Lessons 
          WHERE chapter_id = ? 
          ORDER BY lesson_order ASC
        `, [chapter.chapter_id]);
        
        return {
          ...chapter,
          lessons
        };
      })
    );
    
    // Get exams for the course
    const [exams] = await db.execute(`
      SELECT * FROM Exams 
      WHERE course_id = ? AND chapter_id IS NULL
    `, [id]);
    
    // Return course with chapters, lessons, and exams
    res.json({
      ...course,
      chapters: chaptersWithLessons,
      exams
    });
  } catch (error) {
    console.error('Error getting course details:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin khóa học' });
  }
};

// Get lesson content with pages
exports.getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    // Get lesson details
    const [lessons] = await db.execute(`
      SELECT l.*, c.title as chapter_title, co.title as course_title, co.course_id
      FROM Lessons l
      JOIN Chapters c ON l.chapter_id = c.chapter_id
      JOIN Courses co ON c.course_id = co.course_id
      WHERE l.lesson_id = ?
    `, [lessonId]);
    
    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài học' });
    }
    
    const lesson = lessons[0];
    
    // Get pages for the lesson
    const [pages] = await db.execute(`
      SELECT * FROM Pages 
      WHERE lesson_id = ? 
      ORDER BY page_number ASC
    `, [lessonId]);
    
    // Return lesson with pages
    res.json({
      ...lesson,
      pages
    });
  } catch (error) {
    console.error('Error getting lesson content:', error);
    res.status(500).json({ message: 'Lỗi khi lấy nội dung bài học' });
  }
};

// Create a new course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, major_id } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Tiêu đề khóa học là bắt buộc' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO Courses (title, description, thumbnail, major_id) VALUES (?, ?, ?, ?)',
      [title, description || null, thumbnail || null, major_id || null]
    );
    
    const courseId = result.insertId;
    
    res.status(201).json({
      course_id: courseId,
      title,
      description,
      thumbnail,
      major_id,
      message: 'Tạo khóa học thành công'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Lỗi khi tạo khóa học mới' });
  }
};

// Add a chapter to a course
exports.addChapter = async (req, res) => {
  try {
    const { course_id, title, description } = req.body;
    
    if (!course_id || !title) {
      return res.status(400).json({ message: 'ID khóa học và tiêu đề chương là bắt buộc' });
    }
    
    // Get the max chapter_order and increment by 1
    const [orders] = await db.execute(
      'SELECT MAX(chapter_order) as max_order FROM Chapters WHERE course_id = ?',
      [course_id]
    );
    
    const chapter_order = (orders[0].max_order || 0) + 1;
    
    // Insert the chapter
    const [result] = await db.execute(
      'INSERT INTO Chapters (course_id, title, description, chapter_order) VALUES (?, ?, ?, ?)',
      [course_id, title, description || null, chapter_order]
    );
    
    res.status(201).json({
      chapter_id: result.insertId,
      course_id,
      title,
      description,
      chapter_order,
      message: 'Thêm chương học thành công'
    });
  } catch (error) {
    console.error('Error adding chapter:', error);
    res.status(500).json({ message: 'Lỗi khi thêm chương học mới' });
  }
};

// Add a lesson to a chapter
exports.addLesson = async (req, res) => {
  try {
    const { chapter_id, title, content } = req.body;
    
    if (!chapter_id || !title) {
      return res.status(400).json({ message: 'ID chương và tiêu đề bài học là bắt buộc' });
    }
    
    // Get the max lesson_order and increment by 1
    const [orders] = await db.execute(
      'SELECT MAX(lesson_order) as max_order FROM Lessons WHERE chapter_id = ?',
      [chapter_id]
    );
    
    const lesson_order = (orders[0].max_order || 0) + 1;
    
    // Insert the lesson
    const [result] = await db.execute(
      'INSERT INTO Lessons (chapter_id, title, content, lesson_order) VALUES (?, ?, ?, ?)',
      [chapter_id, title, content || null, lesson_order]
    );
    
    const lessonId = result.insertId;
    
    // Create initial page for the lesson
    await db.execute(
      'INSERT INTO Pages (lesson_id, page_number, content) VALUES (?, ?, ?)',
      [lessonId, 1, '']
    );
    
    res.status(201).json({
      lesson_id: lessonId,
      chapter_id,
      title,
      content,
      lesson_order,
      message: 'Thêm bài học thành công'
    });
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ message: 'Lỗi khi thêm bài học mới' });
  }
};

// Add or update a page in a lesson
exports.updateLessonPage = async (req, res) => {
  try {
    const { lesson_id, page_number, content } = req.body;
    
    if (!lesson_id || !page_number) {
      return res.status(400).json({ message: 'ID bài học và số trang là bắt buộc' });
    }
    
    // Check if page exists
    const [existingPages] = await db.execute(
      'SELECT * FROM Pages WHERE lesson_id = ? AND page_number = ?',
      [lesson_id, page_number]
    );
    
    if (existingPages.length > 0) {
      // Update existing page
      await db.execute(
        'UPDATE Pages SET content = ? WHERE lesson_id = ? AND page_number = ?',
        [content || '', lesson_id, page_number]
      );
      
      res.json({
        page_id: existingPages[0].page_id,
        lesson_id,
        page_number,
        content,
        message: 'Cập nhật trang học thành công'
      });
    } else {
      // Insert new page
      const [result] = await db.execute(
        'INSERT INTO Pages (lesson_id, page_number, content) VALUES (?, ?, ?)',
        [lesson_id, page_number, content || '']
      );
      
      res.status(201).json({
        page_id: result.insertId,
        lesson_id,
        page_number,
        content,
        message: 'Thêm trang học mới thành công'
      });
    }
  } catch (error) {
    console.error('Error updating lesson page:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trang học' });
  }
};

// Get enrollment status and progress for a user
exports.getUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const [enrollments] = await db.execute(
      `SELECT e.*, l.title as current_lesson_title
       FROM Enrollments e
       LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
       WHERE e.user_id = ? AND e.course_id = ?`,
      [userId, courseId]
    );
    
    if (enrollments.length === 0) {
      return res.status(404).json({ 
        enrolled: false,
        message: 'Người dùng chưa đăng ký khóa học này' 
      });
    }
    
    res.json({
      enrolled: true,
      ...enrollments[0]
    });
  } catch (error) {
    console.error('Error getting user course progress:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin tiến độ học tập' });
  }
};

// Enroll a user in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;
    
    if (!user_id || !course_id) {
      return res.status(400).json({ message: 'ID người dùng và ID khóa học là bắt buộc' });
    }
    
    // Check if already enrolled
    const [existingEnrollments] = await db.execute(
      'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
      [user_id, course_id]
    );
    
    if (existingEnrollments.length > 0) {
      return res.status(400).json({ message: 'Người dùng đã đăng ký khóa học này' });
    }
    
    // Get first lesson of the course
    const [firstLessons] = await db.execute(`
      SELECT l.lesson_id FROM Lessons l
      JOIN Chapters c ON l.chapter_id = c.chapter_id
      WHERE c.course_id = ?
      ORDER BY c.chapter_order, l.lesson_order
      LIMIT 1
    `, [course_id]);
    
    const firstLessonId = firstLessons.length > 0 ? firstLessons[0].lesson_id : null;
    
    // Create enrollment
    const [result] = await db.execute(
      'INSERT INTO Enrollments (user_id, course_id, current_lesson_id, progress_percent) VALUES (?, ?, ?, 0)',
      [user_id, course_id, firstLessonId]
    );
    
    res.status(201).json({
      enrollment_id: result.insertId,
      user_id,
      course_id,
      current_lesson_id: firstLessonId,
      progress_percent: 0,
      message: 'Đăng ký khóa học thành công'
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Lỗi khi đăng ký khóa học' });
  }
};

// Update user progress in a course
exports.updateProgress = async (req, res) => {
  try {
    const { user_id, course_id, current_lesson_id, progress_percent } = req.body;
    
    if (!user_id || !course_id || !current_lesson_id) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }
    
    // Update enrollment
    await db.execute(
      'UPDATE Enrollments SET current_lesson_id = ?, progress_percent = ? WHERE user_id = ? AND course_id = ?',
      [current_lesson_id, progress_percent || 0, user_id, course_id]
    );
    
    res.json({
      user_id,
      course_id,
      current_lesson_id,
      progress_percent,
      message: 'Cập nhật tiến độ học tập thành công'
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật tiến độ học tập' });
  }
};

// Get all courses for a specific user with progress
exports.getUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [enrolledCourses] = await db.execute(`
      SELECT c.*, e.progress_percent, e.current_lesson_id, e.enrolled_date,
             l.title as current_lesson_title
      FROM Enrollments e
      JOIN Courses c ON e.course_id = c.course_id
      LEFT JOIN Lessons l ON e.current_lesson_id = l.lesson_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_date DESC
    `, [userId]);
    
    res.json(enrolledCourses);
  } catch (error) {
    console.error('Error getting user courses:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khóa học của người dùng' });
  }
};

// Create an exam for a course or chapter
exports.createExam = async (req, res) => {
  try {
    const { 
      course_id, 
      chapter_id, 
      title, 
      time_limit, 
      total_questions, 
      passing_score 
    } = req.body;
    
    if (!title || (!course_id && !chapter_id)) {
      return res.status(400).json({ 
        message: 'Tiêu đề và ID khóa học hoặc ID chương là bắt buộc' 
      });
    }
    
    const [result] = await db.execute(
      `INSERT INTO Exams 
       (course_id, chapter_id, title, time_limit, total_questions, passing_score) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        course_id || null, 
        chapter_id || null, 
        title, 
        time_limit || 60, 
        total_questions || 0, 
        passing_score || 60.00
      ]
    );
    
    res.status(201).json({
      exam_id: result.insertId,
      course_id,
      chapter_id,
      title,
      time_limit: time_limit || 60,
      total_questions: total_questions || 0,
      passing_score: passing_score || 60.00,
      message: 'Tạo bài kiểm tra thành công'
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Lỗi khi tạo bài kiểm tra' });
  }
};

// Add a question to an exam
exports.addQuestion = async (req, res) => {
  try {
    const { 
      exam_id, 
      question_text, 
      option_a, 
      option_b, 
      option_c, 
      option_d, 
      correct_answer 
    } = req.body;
    
    if (!exam_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin câu hỏi' });
    }
    
    const [result] = await db.execute(
      `INSERT INTO Questions 
       (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer]
    );
    
    // Update total_questions count in the Exams table
    await db.execute(
      'UPDATE Exams SET total_questions = total_questions + 1 WHERE exam_id = ?',
      [exam_id]
    );
    
    res.status(201).json({
      question_id: result.insertId,
      exam_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      message: 'Thêm câu hỏi thành công'
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Lỗi khi thêm câu hỏi' });
  }
};

// Get exam with questions
exports.getExamWithQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    
    // Get exam details
    const [exams] = await db.execute(
      'SELECT * FROM Exams WHERE exam_id = ?',
      [examId]
    );
    
    if (exams.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
    }
    
    const exam = exams[0];
    
    // Get questions
    const [questions] = await db.execute(
      'SELECT * FROM Questions WHERE exam_id = ?',
      [examId]
    );
    
    res.json({
      ...exam,
      questions
    });
  } catch (error) {
    console.error('Error getting exam with questions:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bài kiểm tra' });
  }
};

// Submit exam result
exports.submitExamResult = async (req, res) => {
  try {
    const { user_id, exam_id, score } = req.body;
    
    if (!user_id || !exam_id || score === undefined) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }
    
    // Get passing score from exam
    const [exams] = await db.execute(
      'SELECT passing_score FROM Exams WHERE exam_id = ?',
      [exam_id]
    );
    
    if (exams.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài kiểm tra' });
    }
    
    const passingScore = exams[0].passing_score;
    const status = score >= passingScore ? 'pass' : 'fail';
    
    // Record the score
    const [result] = await db.execute(
      'INSERT INTO Test_Scores (user_id, exam_id, score, status) VALUES (?, ?, ?, ?)',
      [user_id, exam_id, score, status]
    );
    
    res.status(201).json({
      score_id: result.insertId,
      user_id,
      exam_id,
      score,
      status,
      passing_score: passingScore,
      message: status === 'pass' ? 'Chúc mừng! Bạn đã vượt qua bài kiểm tra.' : 'Bạn không vượt qua bài kiểm tra. Hãy thử lại.'
    });
  } catch (error) {
    console.error('Error submitting exam result:', error);
    res.status(500).json({ message: 'Lỗi khi lưu kết quả bài kiểm tra' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, major_id } = req.body;
    
    // Check if course exists
    const [courses] = await db.execute('SELECT * FROM Courses WHERE course_id = ?', [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Update course
    await db.execute(
      'UPDATE Courses SET title = ?, description = ?, thumbnail = ?, major_id = ? WHERE course_id = ?',
      [title, description || null, thumbnail || null, major_id || null, id]
    );
    
    res.json({
      course_id: parseInt(id),
      title,
      description,
      thumbnail,
      major_id,
      message: 'Cập nhật khóa học thành công'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật khóa học' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const [courses] = await db.execute('SELECT * FROM Courses WHERE course_id = ?', [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học' });
    }
    
    // Delete course (cascade delete will handle related data)
    await db.execute('DELETE FROM Courses WHERE course_id = ?', [id]);
    
    res.json({
      message: 'Xóa khóa học thành công'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Lỗi khi xóa khóa học' });
  }
};

module.exports = exports;

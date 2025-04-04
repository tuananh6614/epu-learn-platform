-- Tạo database
CREATE DATABASE IF NOT EXISTS edulearn;
USE edulearn;

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng khóa học
CREATE TABLE IF NOT EXISTS Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    major_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng chương học
CREATE TABLE IF NOT EXISTS Chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    chapter_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

-- Bảng bài học
CREATE TABLE IF NOT EXISTS Lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    lesson_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

-- Bảng trang học
CREATE TABLE IF NOT EXISTS Pages (
    page_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    page_number INT NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE
);

-- Bảng bài kiểm tra
CREATE TABLE IF NOT EXISTS Exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    chapter_id INT,
    title VARCHAR(200),
    time_limit INT, -- thời gian làm bài (phút)
    total_questions INT,
    passing_score DECIMAL(5,2),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(chapter_id) ON DELETE CASCADE
);

-- Bảng câu hỏi trắc nghiệm
CREATE TABLE IF NOT EXISTS Questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('A','B','C','D') NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id) ON DELETE CASCADE
);

-- Bảng lưu điểm bài kiểm tra
CREATE TABLE IF NOT EXISTS Test_Scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pass', 'fail') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES Exams(exam_id) ON DELETE CASCADE
);

-- Bảng đăng ký khóa học và theo dõi tiến trình học
CREATE TABLE IF NOT EXISTS Enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    current_lesson_id INT, -- bài học gần nhất vừa học
    progress_percent DECIMAL(5,2) DEFAULT 0,
    enrolled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (current_lesson_id) REFERENCES Lessons(lesson_id) ON DELETE SET NULL
);

-- Bảng phân loại tài liệu
CREATE TABLE IF NOT EXISTS Document_Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tài liệu
CREATE TABLE IF NOT EXISTS Documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,         
    description TEXT,                    
    file_path VARCHAR(255) NOT NULL,    
    preview_url VARCHAR(255),            
    price DECIMAL(10,0) NOT NULL,  
    category_id INT,                     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Document_Categories(category_id) ON DELETE CASCADE
);

-- Bảng giao dịch tài liệu
CREATE TABLE IF NOT EXISTS Document_Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES Documents(document_id) ON DELETE CASCADE
);

-- Bảng ngành học
CREATE TABLE IF NOT EXISTS Majors (
    major_id INT AUTO_INCREMENT PRIMARY KEY,
    major_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm khóa ngoại major_id vào bảng Courses
ALTER TABLE Courses ADD CONSTRAINT fk_courses_major FOREIGN KEY (major_id) REFERENCES Majors(major_id) ON DELETE SET NULL;

-- Tạo index cho email trong Users
CREATE INDEX idx_users_email ON Users(email);

-- Tạo index cho course_id trong bảng Chapters
CREATE INDEX idx_chapters_course ON Chapters(course_id);

-- Tạo index cho course_id trong bảng Enrollments
CREATE INDEX idx_enrollments_course ON Enrollments(course_id);

-- Tạo admin mặc định (password: admin123)
INSERT INTO Users (full_name, email, password, role)
VALUES ('Admin', 'admin@edulearn.com', '$2b$10$zPMPFQQPfzs8QKKMRakgMu5o0L6vOQWZYTz/WeSv1MJFVCDPz0KTq', 'admin');

-- Tạo người dùng mẫu (password: user123)
INSERT INTO Users (full_name, email, password, role)
VALUES ('Người dùng mẫu', 'user@edulearn.com', '$2b$10$ZwKc6.UGS/FbZdvvwj3RQOk3ON1LSNyrYw/hMZYvjLj.8SvMn1iCe', 'user'); 
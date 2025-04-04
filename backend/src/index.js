const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Đọc biến môi trường từ file .env
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Khởi tạo app Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduLearn API' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

// Xử lý lỗi không mong muốn
process.on('unhandledRejection', (err) => {
  console.log('Lỗi không xử lý:', err.message);
  // Đóng server & thoát process
  process.exit(1);
}); 
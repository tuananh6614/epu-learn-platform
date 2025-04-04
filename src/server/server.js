
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { testConnection } = require('./db');

// Import các routes
const coursesRoutes = require('./routes/courses');
const documentsRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Kiểm tra kết nối cơ sở dữ liệu khi khởi động server
(async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('Đã kết nối thành công đến MySQL');
  } else {
    console.log('Không thể kết nối đến MySQL');
  }
})();

// Routes
app.use('/api/courses', coursesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API đang hoạt động!' });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

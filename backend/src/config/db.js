const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edulearn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối một lần khi khởi động server
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Lỗi kết nối database:', err);
    process.exit(1); // Thoát ứng dụng nếu không thể kết nối database
  }
  connection.release();
});

const promisePool = pool.promise();

module.exports = promisePool; 
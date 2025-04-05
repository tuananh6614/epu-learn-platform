const mysql = require('mysql2');
require('dotenv').config();

console.log('Cấu hình database:', {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'edulearn'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edulearn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error('=== LỖI KẾT NỐI DATABASE ===');
    console.error('Chi tiết lỗi:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage
    });
    throw err;
  }
  console.log('=== KẾT NỐI DATABASE THÀNH CÔNG ===');
  console.log('Server:', connection.serverVersion);
  console.log('Connection ID:', connection.threadId);
  
  // Kiểm tra bảng Users
  connection.query('SHOW TABLES LIKE "Users"', (error, results) => {
    if (error) {
      console.error('Lỗi kiểm tra bảng Users:', error);
    } else {
      console.log('Bảng Users tồn tại:', results.length > 0);
      if (results.length > 0) {
        connection.query('DESCRIBE Users', (err, fields) => {
          if (err) {
            console.error('Lỗi lấy cấu trúc bảng Users:', err);
          } else {
            console.log('Cấu trúc bảng Users:', fields);
          }
        });
      }
    }
  });
  
  connection.release();
});

const promisePool = pool.promise();

module.exports = promisePool; 

const mysql = require('mysql2/promise');

// Tạo pool kết nối đến MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'epu_learn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm kiểm tra kết nối
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Kết nối cơ sở dữ liệu thành công!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};

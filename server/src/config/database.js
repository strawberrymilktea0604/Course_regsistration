const mysql = require('mysql2/promise');
require('dotenv').config();

// Cấu hình pool connection cho MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'dkhp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Thêm các cài đặt bảo mật
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined,
  // Cấu hình timeout
  connectTimeout: 10000, // 10 giây
  // Cấu hình retry
  acquireTimeout: 10000,
  // Debug mode chỉ trong môi trường development
  debug: process.env.NODE_ENV === 'development',
});

// Kiểm tra kết nối khi khởi động
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Hàm truy vấn với retry mechanism
async function query(sql, params, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error(`Query attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Nếu là lỗi kết nối, đợi 1 giây trước khi thử lại
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Các lỗi khác thì throw ngay
      throw error;
    }
  }
  
  throw lastError;
}

// Hàm transaction với retry mechanism
async function transaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};

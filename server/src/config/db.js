const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'dkhp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Log connection config in development
if (process.env.NODE_ENV === 'development') {
  console.log('Database config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });
}

// Test connection function - use this to verify database connectivity
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully!');
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  }
}

// Run test connection when this module is loaded
testConnection();

module.exports = pool;
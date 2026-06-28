// testConnection.js
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  // Create a connection using the specific details
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL database...');
    console.log(`Host: ${process.env.DB_HOST || '127.0.0.1'}`);
    console.log(`Port: ${process.env.DB_PORT || '3306'}`);
    console.log(`User: ${process.env.DB_USER || 'root'}`);
    console.log(`Database: ${process.env.DB_NAME || 'course_registration'}`);
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'course_registration'
    });
    
    console.log('✅ Connection established successfully!');
    
    // Test a simple query to show the course table structure
    const test_query = await connection.execute('DESCRIBE courses');
    console.log('Course table structure:');
    test_query[0].forEach(column => {
      console.log(`- ${column.Field} (${column.Type}) ${column.Key === 'PRI' ? '[PRIMARY KEY]' : ''} ${column.Null === 'NO' ? '[NOT NULL]' : ''}`);
    });

    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    // Provide more specific troubleshooting based on error
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nAccess denied - check your username and password');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nConnection refused - make sure MySQL server is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nDatabase does not exist - create it first');
    }
    
    console.log('\nGeneral troubleshooting tips:');
    console.log('- Verify MySQL server is running');
    console.log('- Check if you can connect using MySQL client: mysql -h 127.0.0.1 -P 3306 -u root -p');
    console.log('- Ensure the database exists: CREATE DATABASE course_registration;');
    
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('Database connection test passed successfully!');
    } else {
      console.log('Please fix the database connection issues before proceeding.');
    }
    process.exit(0);
  });
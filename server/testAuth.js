// testAuth.js
const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';
let token = null;

// Test login
async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin2',
      password: 'admin123',
      role: 'admin'
    });
    
    if (response.data.success) {
      console.log('✅ Login successful!');
      token = response.data.token;
      console.log('Token:', token);
      return token;
    } else {
      console.log('❌ Login failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Login error:', error.response?.data?.message || error.message);
  }
}

// Test registration
async function testRegister() {
  try {
    console.log('\nTesting registration...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      username: "student" + Date.now(), // Generate unique username
      password: "password123",
      student_id: "ST" + Date.now().toString().slice(-5), // Generate unique student ID
      email: `student${Date.now()}@example.com`, // Generate unique email
      full_name: "Test Student",
      program_id: 1
    });
    
    if (response.data.success) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data?.message || error.message);
  }
}

// Test profile endpoint
async function testProfile(token) {
  try {
    console.log('\nTesting profile...');
    if (!token) {
      console.log('❌ No authentication token available');
      return;
    }
    
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      console.log('✅ Profile fetch successful!');
      console.log('User data:', response.data.user);
    } else {
      console.log('❌ Profile fetch failed:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Profile error:', error.response?.data?.message || error.message);
  }
}

// Run tests sequentially
async function runTests() {
  const authToken = await testLogin();
  await testRegister();
  await testProfile(authToken);
}

runTests();
// test-course-api.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
let authToken = '';

// Admin login to get token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    authToken = response.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get all courses
async function getAllCourses() {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    console.log('✅ Get all courses successful');
    console.log(`Retrieved ${response.data.count} courses`);
    return true;
  } catch (error) {
    console.error('❌ Get all courses failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get course by ID
async function getCourseById(id) {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}`);
    console.log(`✅ Get course by ID ${id} successful`);
    console.log(`Course: ${response.data.data.title} (${response.data.data.code})`);
    return true;
  } catch (error) {
    console.error(`❌ Get course by ID ${id} failed:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Test create course (admin only)
async function createCourse() {
  if (!authToken) {
    console.error('❌ Create course failed: Not authenticated');
    return false;
  }
  
  try {
    const response = await axios.post(
      `${API_URL}/courses`,
      {
        code: 'TEST101',
        title: 'Test Course',
        description: 'This is a test course',
        credits: 3,
        category_id: 1,
        max_capacity: 25
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('✅ Create course successful');
    console.log(`Created course ID: ${response.data.data.id}`);
    return response.data.data.id;
  } catch (error) {
    console.error('❌ Create course failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test update course (admin only)
async function updateCourse(id) {
  if (!authToken) {
    console.error('❌ Update course failed: Not authenticated');
    return false;
  }
  
  try {
    const response = await axios.put(
      `${API_URL}/courses/${id}`,
      {
        title: 'Updated Test Course',
        max_capacity: 30
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log(`✅ Update course ID ${id} successful`);
    console.log(`Updated title: ${response.data.data.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Update course ID ${id} failed:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Test search courses
async function searchCourses() {
  try {
    const response = await axios.get(`${API_URL}/courses/search?title=test`);
    console.log('✅ Search courses successful');
    console.log(`Found ${response.data.count} courses matching "test"`);
    return true;
  } catch (error) {
    console.error('❌ Search courses failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test get course enrollment
async function getCourseEnrollment(id) {
  try {
    const response = await axios.get(`${API_URL}/courses/${id}/enrollment`);
    console.log(`✅ Get course ID ${id} enrollment successful`);
    console.log(`Enrollment: ${response.data.data.registered_students}/${response.data.data.max_capacity}`);
    return true;
  } catch (error) {
    console.error(`❌ Get course ID ${id} enrollment failed:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Test delete course (admin only)
async function deleteCourse(id) {
  if (!authToken) {
    console.error('❌ Delete course failed: Not authenticated');
    return false;
  }
  
  try {
    const response = await axios.delete(
      `${API_URL}/courses/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log(`✅ Delete course ID ${id} successful`);
    console.log(`Message: ${response.data.message}`);
    return true;
  } catch (error) {
    console.error(`❌ Delete course ID ${id} failed:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🔍 Starting Course API tests...\n');
  
  // Test public endpoints first
  await getAllCourses();
  console.log('');
  
  // Login to get admin token
  const loggedIn = await login();
  if (!loggedIn) {
    console.log('\n❌ Skipping admin-only tests due to login failure');
    return;
  }
  console.log('');
  
  // Test admin endpoints
  const courseId = await createCourse();
  console.log('');
  
  if (courseId) {
    await getCourseById(courseId);
    console.log('');
    
    await updateCourse(courseId);
    console.log('');
    
    await searchCourses();
    console.log('');
    
    await getCourseEnrollment(courseId);
    console.log('');
    
    await deleteCourse(courseId);
  }
  
  console.log('\n✅ Course API tests completed');
}

// Run the tests
runTests().catch(console.error);
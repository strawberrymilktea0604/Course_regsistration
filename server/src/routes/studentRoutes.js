const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticateToken, isStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication and student role check to all routes
router.use(authenticateToken);
router.use(isStudent);

// Get all available courses
router.get('/courses', studentController.getAvailableCourses);

// Get student's registered courses
router.get('/my-courses', studentController.getStudentCourses);

// Get student's daily schedule
router.get('/schedule', studentController.getDailySchedule);

// Get schedule for a specific registration
router.get('/course-schedule/:registrationId', studentController.getCourseSchedule);

// Register for a course
router.post('/register/:courseId', studentController.registerForCourse);

// Drop a course registration by registration ID
router.put('/drop/:id', authenticateToken, isStudent, studentController.dropRegistration);

// Get student profile
router.get('/profile', studentController.getStudentProfile);

// Update student profile
router.put('/profile', studentController.updateStudentProfile);

// Get registration history
router.get('/registration-history', studentController.getRegistrationHistory);

module.exports = router;
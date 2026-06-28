const express = require('express');
const adminController = require('../controllers/adminControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check admin authentication
router.use(authMiddleware.authenticateToken, authMiddleware.isAdmin);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Course management routes
router.get('/courses', adminController.getAllCourses);
router.get('/courses/:id', adminController.getCourseById);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Registration management routes
router.get('/registrations', adminController.getAllRegistrations);
router.get('/registrations/:id', adminController.getRegistrationById);
router.put('/registrations/:id/status', adminController.updateRegistrationStatus);

// Dashboard and statistics routes
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
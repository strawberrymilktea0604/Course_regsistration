const express = require('express');
const registrationController = require('../controllers/registrationController');
const { authenticateToken, isAdmin, isAdminOrStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Admin-only routes
router.get('/', isAdmin, registrationController.getAllRegistrations);

// Student-specific routes
router.get('/my-registrations', registrationController.getMyRegistrations);
// New route for student course signup (one time only)
router.post('/course-signup', registrationController.studentCourseSignup);
// New route for batch course registration
router.post('/batch', registrationController.batchRegisterCourses);
// New route for batch course drop
router.post('/batch-drop', registrationController.batchDropCourses);
// New route for timetable 
router.get('/my-timetable', authenticateToken, registrationController.getMyTimetable);

// Routes with ID parameter - need special handling for user-specific routes
router.get('/user/:userId', isAdminOrStudent, registrationController.getRegistrationsByUser);
router.get('/course/:courseId', isAdmin, registrationController.getRegistrationsByCourse);

// Mixed access routes - controller handles permission checks
router.get('/:id', isAdminOrStudent, registrationController.getRegistrationById);
router.post('/', isAdminOrStudent, registrationController.createRegistration);
router.put('/:id', isAdmin, registrationController.updateRegistration);
router.delete('/:id', isAdminOrStudent, registrationController.deleteRegistration);

// allow student (own) or admin to drop
router.put(
    '/:id/drop',
    authenticateToken,
    isAdminOrStudent,
    registrationController.deleteRegistration
  );

module.exports = router;
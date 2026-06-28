const express = require('express');
const authController = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public authentication routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/change-password', authenticateToken, authController.changePassword);
router.post('/refresh-token', authenticateToken, authController.refreshToken);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
const express = require('express');
const accountController = require('../controllers/accountController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(isAdmin);

// Get all accounts with filtering and sorting
router.get('/', accountController.getAllAccounts);

// Get account by ID
router.get('/:id', accountController.getAccountById);

// Create new account
router.post('/', accountController.createAccount);

// Update account
router.put('/:id', accountController.updateAccount);

// Delete account
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Export both the original name and the alias for backwards compatibility
exports.verifyToken = exports.authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists in the appropriate table based on role
    let query;
    if (decoded.role === 'admin') {
      query = 'SELECT id, username FROM admins WHERE id = ?';
    } else if (decoded.role === 'student') {
      query = 'SELECT id, username FROM students WHERE id = ?';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Unknown role.'
      });
    }
    
    const [rows] = await pool.query(query, [decoded.id]);
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Authentication middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next();
};

/**
 * Middleware to check if user is student
 */
exports.isStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Student privileges required.'
    });
  }
  
  next();
};

/**
 * Middleware to check if user is either admin or student
 */
exports.isAdminOrStudent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Insufficient privileges.'
    });
  }
  
  next();
};
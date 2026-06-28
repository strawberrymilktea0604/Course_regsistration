/**
 * Middleware to check if the user has the required role(s)
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {function} Middleware function
 */
const checkRole = (roles) => {
    // Convert single role to array for consistent handling
    if (typeof roles === 'string') {
        roles = [roles];
    }
    
    return (req, res, next) => {
        // Check if user exists on request (should be set by auth middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get user role
        const userRole = req.user.role;
        
        // Check if user's role is in the allowed roles
        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'Forbidden: You do not have the required permissions' 
            });
        }
        
        // User has required role, proceed to next middleware
        next();
    };
};

module.exports = checkRole;
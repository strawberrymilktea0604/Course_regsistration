const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Admin } = require('../models');
const config = require('../config/');

class AdminAuthService {
    /**
     * Admin login service
     * @param {string} username 
     * @param {string} password 
     * @returns {object} token and admin data
     */
    async login(username, password) {
        try {
            // Find admin in admin table
            const admin = await Admin.findOne({ where: { username } });
            
            if (!admin) {
                throw new Error('Admin not found');
            }
            
            // Verify password
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: admin.id,
                    username: admin.username,
                    role: 'admin'
                },
                config.jwtSecret,
                { expiresIn: '1h' }
            );
            
            // Return token and admin info (excluding password)
            const adminData = admin.toJSON();
            delete adminData.password;
            
            return {
                token,
                admin: adminData
            };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Verify admin token
     * @param {string} token 
     * @returns {object} decoded token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

module.exports = new AdminAuthService();
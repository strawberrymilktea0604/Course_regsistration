const AdminService = require('../services/adminService');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

class AdminController {
    // Course Management
    async getAllCourses(req, res) {
        try {
            const courses = await AdminService.getAllCourses();
            return res.status(200).json({ success: true, data: courses });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getCourseById(req, res) {
        try {
            const { id } = req.params;
            const course = await AdminService.getCourseById(id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            return res.status(200).json({ success: true, data: course });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async createCourse(req, res) {
        try {
            const courseData = req.body;
            if (!courseData.name || !courseData.description || !courseData.credits) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            
            const course = await AdminService.createCourse(courseData);
            return res.status(201).json({ success: true, data: course });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateCourse(req, res) {
        try {
            const { id } = req.params;
            const courseData = req.body;
            
            const course = await AdminService.updateCourse(id, courseData);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            return res.status(200).json({ success: true, data: course });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const result = await AdminService.deleteCourse(id);
            if (!result) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }
            return res.status(200).json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // User Management
    async getAllUsers(req, res) {
        try {
            // Get both admins and students
            const [admins] = await pool.query(`
                SELECT id, username, email, created_at, last_login, 'admin' as role
                FROM admins
                ORDER BY id
            `);
            
            const [students] = await pool.query(`
                SELECT s.id, s.username, s.email, s.student_id, s.full_name, s.class,
                       p.name as program_name, s.created_at, s.last_login, 'student' as role
                FROM students s
                JOIN academic_programs p ON s.program_id = p.id
                ORDER BY s.id
            `);
            
            // Combine the results
            const users = [...admins, ...students];
            
            return res.status(200).json({ 
                success: true, 
                count: users.length,
                data: users 
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching users', 
                error: process.env.NODE_ENV === 'development' ? error.message : undefined 
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.query;
            
            if (!role || (role !== 'admin' && role !== 'student')) {
                return res.status(400).json({
                    success: false,
                    message: 'Role parameter is required (admin or student)'
                });
            }
            
            let query;
            let params = [id];
            
            if (role === 'admin') {
                query = `SELECT id, username, email, created_at, last_login
                         FROM admins WHERE id = ?`;
            } else {
                query = `SELECT s.id, s.username, s.email, s.student_id, s.full_name,
                        s.date_of_birth, s.class, s.enrollment_date, s.created_at, s.last_login,
                        p.name as program_name, p.description as program_description
                        FROM students s
                        JOIN academic_programs p ON s.program_id = p.id
                        WHERE s.id = ?`;
            }
            
            const [rows] = await pool.query(query, params);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `${role.charAt(0).toUpperCase() + role.slice(1)} with ID ${id} not found`
                });
            }
            
            return res.status(200).json({
                success: true,
                data: rows[0]
            });
        } catch (error) {
            console.error(`Error fetching user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async createUser(req, res) {
        try {
            const { role, username, password, email, ...userData } = req.body;
            
            if (!role || !username || !password || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Role, username, password, and email are required'
                });
            }
            
            if (role !== 'admin' && role !== 'student') {
                return res.status(400).json({
                    success: false,
                    message: 'Role must be either admin or student'
                });
            }
            
            // Check if username or email already exists
            const [existingUser] = await pool.query(
                `SELECT username, email FROM ${role}s WHERE username = ? OR email = ?`,
                [username, email]
            );
            
            if (existingUser.length > 0) {
                let message = 'User creation failed: ';
                const user = existingUser[0];
                
                if (user.username === username) {
                    message += 'Username already exists. ';
                }
                if (user.email === email) {
                    message += 'Email already exists. ';
                }
                
                return res.status(400).json({
                    success: false,
                    message: message.trim()
                });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            let result;
            if (role === 'admin') {
                // Create admin
                const [insertResult] = await pool.query(
                    `INSERT INTO admins (username, password_admin, email) 
                     VALUES (?, ?, ?)`,
                    [username, hashedPassword, email]
                );
                
                result = insertResult;
            } else {
                // Student-specific validations
                const { student_id, full_name, program_id } = userData;
                
                if (!student_id || !full_name || !program_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Student ID, full name, and program ID are required for student creation'
                    });
                }
                
                // Check if student_id already exists
                const [existingStudentId] = await pool.query(
                    'SELECT id FROM students WHERE student_id = ?',
                    [student_id]
                );
                
                if (existingStudentId.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Student ID already exists'
                    });
                }
                
                // Check if program_id exists
                const [program] = await pool.query(
                    'SELECT id FROM academic_programs WHERE id = ?',
                    [program_id]
                );
                
                if (program.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid program ID'
                    });
                }
                
                // Create student
                const [insertResult] = await pool.query(
                    `INSERT INTO students (
                        username, password_student, student_id, email, full_name, 
                        date_of_birth, class, program_id, enrollment_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
                    [
                        username, 
                        hashedPassword, 
                        student_id, 
                        email, 
                        full_name, 
                        userData.date_of_birth || null,
                        userData.class || null,
                        program_id
                    ]
                );
                
                result = insertResult;
            }
            
            return res.status(201).json({
                success: true,
                message: `${role} created successfully`,
                id: result.insertId
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { role, ...updateData } = req.body;
            
            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'Role parameter is required (admin or student)'
                });
            }
            
            if (role !== 'admin' && role !== 'student') {
                return res.status(400).json({
                    success: false,
                    message: 'Role must be either admin or student'
                });
            }
            
            // Check if user exists
            const [existingUser] = await pool.query(
                `SELECT * FROM ${role}s WHERE id = ?`,
                [id]
            );
            
            if (existingUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `${role.charAt(0).toUpperCase() + role.slice(1)} with ID ${id} not found`
                });
            }
            
            // Handle password update separately
            let hashedPassword;
            if (updateData.password) {
                hashedPassword = await bcrypt.hash(updateData.password, 10);
                delete updateData.password;
            }
            
            // Build update query
            const updateFields = [];
            const updateValues = [];
            
            // Add fields to update
            Object.entries(updateData).forEach(([key, value]) => {
                // Skip certain fields that shouldn't be updated
                if (key === 'id' || key === 'created_at') return;
                
                // Handle password field name based on role
                if (key === 'password') {
                    key = role === 'admin' ? 'password_admin' : 'password_student';
                    value = hashedPassword;
                }
                
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            });
            
            // Add password if it was provided
            if (hashedPassword) {
                const passwordField = role === 'admin' ? 'password_admin' : 'password_student';
                updateFields.push(`${passwordField} = ?`);
                updateValues.push(hashedPassword);
            }
            
            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid fields provided for update'
                });
            }
            
            // Add ID as the last parameter
            updateValues.push(id);
            
            // Execute update
            const query = `UPDATE ${role}s SET ${updateFields.join(', ')} WHERE id = ?`;
            await pool.query(query, updateValues);
            
            // Get updated user
            const [updatedUser] = await pool.query(
                `SELECT * FROM ${role}s WHERE id = ?`,
                [id]
            );
            
            // Remove password field from response
            const responseData = { ...updatedUser[0] };
            delete responseData[role === 'admin' ? 'password_admin' : 'password_student'];
            
            return res.status(200).json({
                success: true,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} updated successfully`,
                data: responseData
            });
        } catch (error) {
            console.error(`Error updating user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.query;
            
            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: 'Role parameter is required (admin or student)'
                });
            }
            
            if (role !== 'admin' && role !== 'student') {
                return res.status(400).json({
                    success: false,
                    message: 'Role must be either admin or student'
                });
            }
            
            // Check if user exists
            const [existingUser] = await pool.query(
                `SELECT * FROM ${role}s WHERE id = ?`,
                [id]
            );
            
            if (existingUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `${role.charAt(0).toUpperCase() + role.slice(1)} with ID ${id} not found`
                });
            }
            
            // If deleting a student, check for related data
            if (role === 'student') {
                // Check for active registrations
                const [registrations] = await pool.query(
                    'SELECT COUNT(*) as count FROM registrations WHERE student_id = ? AND registration_status = "enrolled"',
                    [id]
                );
                
                if (registrations[0].count > 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot delete student with ${registrations[0].count} active registrations. Please drop or complete them first.`
                    });
                }
            }
            
            // Delete user
            await pool.query(
                `DELETE FROM ${role}s WHERE id = ?`,
                [id]
            );
            
            return res.status(200).json({
                success: true,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully`
            });
        } catch (error) {
            console.error(`Error deleting user with ID ${req.params.id}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Registration Management
    async getAllRegistrations(req, res) {
        try {
            const registrations = await AdminService.getAllRegistrations();
            return res.status(200).json({ success: true, data: registrations });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getRegistrationById(req, res) {
        try {
            const { id } = req.params;
            
            const [registration] = await pool.query(`
                SELECT r.*, s.username as student_username, s.full_name as student_name,
                c.course_code, c.title as course_title, at.term_name
                FROM registrations r
                JOIN students s ON r.student_id = s.id
                JOIN course_offerings co ON r.course_offering_id = co.id
                JOIN courses c ON co.course_id = c.id
                JOIN academic_terms at ON co.term_id = at.id
                WHERE r.id = ?
            `, [id]);
            
            if (registration.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Registration with ID ${id} not found`
                });
            }
            
            return res.status(200).json({
                success: true,
                data: registration[0]
            });
        } catch (error) {
            console.error(`Error fetching registration with ID ${req.params.id}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching registration',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateRegistrationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, grade } = req.body;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }
            
            // Validate status
            const validStatuses = ['enrolled', 'waitlisted', 'dropped', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Status must be one of: ${validStatuses.join(', ')}`
                });
            }
            
            // Check if registration exists
            const [existingReg] = await pool.query(
                'SELECT * FROM registrations WHERE id = ?',
                [id]
            );
            
            if (existingReg.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Registration with ID ${id} not found`
                });
            }
            
            // Update query parts
            const updateFields = ['registration_status = ?'];
            const updateValues = [status];
            
            // Add grade if provided and status is completed
            if (status === 'completed' && grade) {
                updateFields.push('grade = ?');
                updateValues.push(grade);
            }
            
            // Add registration ID
            updateValues.push(id);
            
            // Execute update
            await pool.query(
                `UPDATE registrations SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
            
            // Update course offering enrollment count if status changed
            if (existingReg[0].registration_status !== status) {
                const courseOfferingId = existingReg[0].course_offering_id;
                
                if (status === 'enrolled' && existingReg[0].registration_status !== 'enrolled') {
                    // Increment enrollment count
                    await pool.query(
                        'UPDATE course_offerings SET current_enrollment = current_enrollment + 1 WHERE id = ?',
                        [courseOfferingId]
                    );
                } else if (status !== 'enrolled' && existingReg[0].registration_status === 'enrolled') {
                    // Decrement enrollment count
                    await pool.query(
                        'UPDATE course_offerings SET current_enrollment = current_enrollment - 1 WHERE id = ?',
                        [courseOfferingId]
                    );
                }
            }
            
            return res.status(200).json({
                success: true,
                message: 'Registration status updated successfully'
            });
        } catch (error) {
            console.error(`Error updating registration status for ID ${req.params.id}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Error updating registration status',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async approveRegistration(req, res) {
        try {
            const { id } = req.params;
            const result = await AdminService.approveRegistration(id);
            if (!result) {
                return res.status(404).json({ success: false, message: 'Registration not found' });
            }
            return res.status(200).json({ success: true, message: 'Registration approved successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async rejectRegistration(req, res) {
        try {
            const { id } = req.params;
            const result = await AdminService.rejectRegistration(id);
            if (!result) {
                return res.status(404).json({ success: false, message: 'Registration not found' });
            }
            return res.status(200).json({ success: true, message: 'Registration rejected successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // Dashboard Statistics
    async getDashboardStats(req, res) {
        try {
            const stats = await AdminService.getDashboardStats();
            return res.status(200).json({ success: true, data: stats });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AdminController();
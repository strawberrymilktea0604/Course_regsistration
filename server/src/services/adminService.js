const pool = require('../config/db');

/**
 * Service for admin operations
 */
class AdminService {
  /**
   * Get all courses
   * @returns {Promise<Array>} List of courses
   */
  async getAllCourses() {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, cc.name as category_name 
        FROM courses c
        LEFT JOIN course_categories cc ON c.category_id = cc.id
        ORDER BY c.course_code
      `);
      
      return rows;
    } catch (error) {
      console.error('Error in AdminService.getAllCourses:', error.message);
      throw error;
    }
  }

  /**
   * Get course by ID
   * @param {number} id Course ID
   * @returns {Promise<Object>} Course details
   */
  async getCourseById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, cc.name as category_name 
        FROM courses c
        LEFT JOIN course_categories cc ON c.category_id = cc.id
        WHERE c.id = ?
      `, [id]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error in AdminService.getCourseById(${id}):`, error.message);
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {Object} courseData Course data
   * @returns {Promise<Object>} Created course
   */
  async createCourse(courseData) {
    try {
      const { 
        code, 
        name, 
        description, 
        credits, 
        category_id, 
        max_capacity = 30,
        created_by = 1  // Default admin ID if not provided
      } = courseData;
      
      // Insert the new course
      const [result] = await pool.query(
        `INSERT INTO courses 
          (course_code, title, course_description, credits, category_id, max_capacity, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [code, name, description, credits, category_id, max_capacity, created_by]
      );
      
      // Get the newly created course
      return this.getCourseById(result.insertId);
    } catch (error) {
      console.error('Error in AdminService.createCourse:', error.message);
      throw error;
    }
  }

  /**
   * Update a course
   * @param {number} id Course ID
   * @param {Object} courseData Updated course data
   * @returns {Promise<Object>} Updated course
   */
  async updateCourse(id, courseData) {
    try {
      // Check if course exists
      const course = await this.getCourseById(id);
      if (!course) {
        return null;
      }
      
      const { 
        code, 
        name, 
        description, 
        credits, 
        category_id, 
        max_capacity,
        active
      } = courseData;
      
      // Build update query
      const updateFields = [];
      const updateValues = [];
      
      if (code) {
        updateFields.push('course_code = ?');
        updateValues.push(code);
      }
      
      if (name) {
        updateFields.push('title = ?');
        updateValues.push(name);
      }
      
      if (description !== undefined) {
        updateFields.push('course_description = ?');
        updateValues.push(description);
      }
      
      if (credits !== undefined) {
        updateFields.push('credits = ?');
        updateValues.push(credits);
      }
      
      if (category_id !== undefined) {
        updateFields.push('category_id = ?');
        updateValues.push(category_id);
      }
      
      if (max_capacity !== undefined) {
        updateFields.push('max_capacity = ?');
        updateValues.push(max_capacity);
      }
      
      if (active !== undefined) {
        updateFields.push('active = ?');
        updateValues.push(active);
      }
      
      if (updateFields.length === 0) {
        return course; // No changes needed
      }
      
      // Add course ID to values
      updateValues.push(id);
      
      // Execute update
      await pool.query(
        `UPDATE courses SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );
      
      // Get updated course
      return this.getCourseById(id);
    } catch (error) {
      console.error(`Error in AdminService.updateCourse(${id}):`, error.message);
      throw error;
    }
  }

  /**
   * Delete a course
   * @param {number} id Course ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCourse(id) {
    try {
      // Check if course exists
      const course = await this.getCourseById(id);
      if (!course) {
        return false;
      }
      

      
      if (registrations[0].count > 0) {
        // Soft delete by setting active=false
        await pool.query('UPDATE courses SET active = FALSE WHERE id = ?', [id]);
        return true;
      }
      
      // Hard delete if no registrations
      await pool.query('DELETE FROM courses WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error in AdminService.deleteCourse(${id}):`, error.message);
      throw error;
    }
  }

  /**
   * Get all registrations
   * @returns {Promise<Array>} List of registrations
   */
  async getAllRegistrations() {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, s.username as student_username, s.full_name as student_name,
        c.course_code, c.title as course_title, at.term_name
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN course_offerings co ON r.course_offering_id = co.id
        JOIN courses c ON co.course_id = c.id
        JOIN academic_terms at ON co.term_id = at.id
        ORDER BY r.registration_date DESC
      `);
      
      return rows;
    } catch (error) {
      console.error('Error in AdminService.getAllRegistrations:', error.message);
      throw error;
    }
  }

  /**
   * Approve a registration
   * @param {number} id Registration ID
   * @returns {Promise<boolean>} Success status
   */
  async approveRegistration(id) {
    try {
      // Check if registration exists
      const [registration] = await pool.query(
        'SELECT * FROM registrations WHERE id = ?',
        [id]
      );
      
      if (registration.length === 0) {
        return false;
      }
      
      // Update status to enrolled
      await pool.query(
        'UPDATE registrations SET registration_status = "enrolled" WHERE id = ?',
        [id]
      );
      
      // Update enrollment count if previous status wasn't enrolled
      if (registration[0].registration_status !== 'enrolled') {
        await pool.query(
          'UPDATE course_offerings SET current_enrollment = current_enrollment + 1 WHERE id = ?',
          [registration[0].course_offering_id]
        );
      }
      
      return true;
    } catch (error) {
      console.error(`Error in AdminService.approveRegistration(${id}):`, error.message);
      throw error;
    }
  }

  /**
   * Reject a registration
   * @param {number} id Registration ID
   * @returns {Promise<boolean>} Success status
   */
  async rejectRegistration(id) {
    try {
      // Check if registration exists
      const [registration] = await pool.query(
        'SELECT * FROM registrations WHERE id = ?',
        [id]
      );
      
      if (registration.length === 0) {
        return false;
      }
      
      // Update status to dropped
      await pool.query(
        'UPDATE registrations SET registration_status = "dropped" WHERE id = ?',
        [id]
      );
      
      // Update enrollment count if previous status was enrolled
      if (registration[0].registration_status === 'enrolled') {
        await pool.query(
          'UPDATE course_offerings SET current_enrollment = current_enrollment - 1 WHERE id = ?',
          [registration[0].course_offering_id]
        );
      }
      
      return true;
    } catch (error) {
      console.error(`Error in AdminService.rejectRegistration(${id}):`, error.message);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Get counts of various entities
      const [courseCount] = await pool.query('SELECT COUNT(*) as count FROM courses');
      const [studentCount] = await pool.query('SELECT COUNT(*) as count FROM students');
      const [registrationCount] = await pool.query('SELECT COUNT(*) as count FROM registrations');
      const [activeRegistrations] = await pool.query(
        'SELECT COUNT(*) as count FROM registrations WHERE registration_status = "enrolled"'
      );
      
      // Get course statistics
      const [courseStats] = await pool.query(`
        SELECT c.course_code, c.title, COUNT(r.id) as registration_count
        FROM courses c
        LEFT JOIN course_offerings co ON c.id = co.course_id
        LEFT JOIN registrations r ON co.id = r.course_offering_id AND r.registration_status = 'enrolled'
        GROUP BY c.id
        ORDER BY registration_count DESC
        LIMIT 5
      `);
      
      return {
        counts: {
          courses: courseCount[0].count,
          students: studentCount[0].count,
          registrations: registrationCount[0].count,
          activeRegistrations: activeRegistrations[0].count
        },
        popularCourses: courseStats
      };
    } catch (error) {
      console.error('Error in AdminService.getDashboardStats:', error.message);
      throw error;
    }
  }
}

module.exports = new AdminService();
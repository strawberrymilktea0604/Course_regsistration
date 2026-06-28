// controllers/courseController.js
const pool = require('../config/db');

/**
 * Get all courses
 * @route GET /api/courses
 * @access Public
 */
const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cc.name as category_name 
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.active = TRUE
      ORDER BY c.course_code
    `);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: error.message
    });
  }
};

/**
 * Get a single course by ID
 * @route GET /api/courses/:id
 * @access Public
 */
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const [rows] = await pool.query(`
      SELECT c.*, cc.name as category_name 
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.id = ? AND c.active = TRUE
    `, [courseId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`Error fetching course with ID ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
      error: error.message
    });
  }
};

/**
 * Create a new course
 * @route POST /api/courses
 * @access Private (Admin only)
 */
const createCourse = async (req, res) => {
  try {
    const { code, title, description, credits, category_id, max_capacity, is_non_cumulative } = req.body;
    const adminId = req.user.id;

    // Validate required fields
    if (!code || !title || !credits) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code, title, and credits'
      });
    }

    // Check if course already exists with the same code
    const [existingCourses] = await pool.query(
      'SELECT * FROM courses WHERE course_code = ?',
      [code]
    );

    if (existingCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Course with code ${code} already exists`
      });
    }

    // Find the smallest available ID
    const [allCourses] = await pool.query('SELECT id FROM courses ORDER BY id');
    let newId = 1;
    
    // Find first gap in IDs or use next number after highest existing ID
    if (allCourses.length > 0) {
      for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].id !== i + 1) {
          newId = i + 1;
          break;
        }
        if (i === allCourses.length - 1) {
          newId = allCourses[i].id + 1;
        }
      }
    }

    // Insert the new course with the determined ID
    const [result] = await pool.query(
      `INSERT INTO courses 
        (id, course_code, title, course_description, credits, category_id, max_capacity, created_by, is_non_cumulative)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        code, 
        title, 
        description || null, 
        credits, 
        category_id || null, 
        max_capacity || 30, 
        adminId,
        is_non_cumulative || false
      ]
    );
    
    // Fetch the newly created course with category name
    const [newCourse] = await pool.query(`
      SELECT c.*, cc.name as category_name 
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.id = ?
    `, [newId]);
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse[0]
    });
  } catch (error) {
    console.error('Error creating course:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update a course
 * @route PUT /api/courses/:id
 * @access Private (Admin only)
 */
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { 
      code, 
      title, 
      description, 
      credits, 
      category_id, 
      max_capacity,
      active,
      is_non_cumulative
    } = req.body;
    
    // Check if course exists
    const [existingCourse] = await pool.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} not found`
      });
    }
    
    // Check if updating to a code that already exists (excluding this course)
    if (code) {
      const [codeExists] = await pool.query(
        'SELECT * FROM courses WHERE course_code = ? AND id != ?',
        [code, courseId]
      );
      
      if (codeExists.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Another course with code ${code} already exists`
        });
      }
    }
    
    // Validate category if provided
    if (category_id) {
      const [categoryExists] = await pool.query(
        'SELECT * FROM course_categories WHERE id = ?',
        [category_id]
      );
      
      if (categoryExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Category with ID ${category_id} does not exist`
        });
      }
    }
    
    // Build update query dynamically based on provided fields
    let updateQuery = 'UPDATE courses SET ';
    const updateValues = [];
    const updateFields = [];
    
    if (code) {
      updateFields.push('course_code = ?');
      updateValues.push(code);
    }
    
    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    
    if (description !== undefined) {
      updateFields.push('course_description = ?');
      updateValues.push(description);
    }
    
    if (credits) {
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

    if (is_non_cumulative !== undefined) {
      updateFields.push('is_non_cumulative = ?');
      updateValues.push(is_non_cumulative);
    }
    
    // If no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided for update'
      });
    }
    
    updateQuery += updateFields.join(', ');
    updateQuery += ' WHERE id = ?';
    updateValues.push(courseId);
    
    // Execute the update
    await pool.query(updateQuery, updateValues);
    
    // Get the updated course with category name
    const [updatedCourse] = await pool.query(`
      SELECT c.*, cc.name as category_name 
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.id = ?
    `, [courseId]);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse[0]
    });
  } catch (error) {
    console.error(`Error updating course with ID ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course',
      error: error.message
    });
  }
};

/**
 * Delete a course (soft delete by setting active=false)
 * @route DELETE /api/courses/:id
 * @access Private (Admin only)
 */
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Check if course exists
    const [existingCourse] = await pool.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (existingCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} not found`
      });
    }
    
    // Check if course has registrations
    const [registrations] = await pool.query(
      'SELECT COUNT(*) as count FROM registrations r JOIN course_offerings co ON r.course_offering_id = co.id WHERE co.course_id = ?',
      [courseId]
    );
    
    if (registrations[0].count > 0) {
      // Soft delete by setting active=false instead of deleting
      await pool.query('UPDATE courses SET active = FALSE WHERE id = ?', [courseId]);
      
      return res.status(200).json({
        success: true,
        message: `Course with ID ${courseId} has been deactivated because it has ${registrations[0].count} active registrations`
      });
    }
    
    // Hard delete if no registrations
    await pool.query('DELETE FROM courses WHERE id = ?', [courseId]);
    
    res.status(200).json({
      success: true,
      message: `Course with ID ${courseId} deleted successfully`
    });
  } catch (error) {
    console.error(`Error deleting course with ID ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course',
      error: error.message
    });
  }
};

/**
 * Search courses by criteria
 * @route GET /api/courses/search
 * @access Public
 */
const searchCourses = async (req, res) => {
  try {
    const { code, title, category_id, credits } = req.query;
    let query = `
      SELECT c.*, cc.name as category_name 
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.active = TRUE
    `;
    const params = [];
    
    if (code) {
      query += ' AND c.code LIKE ?';
      params.push(`%${code}%`);
    }
    
    if (title) {
      query += ' AND c.title LIKE ?';
      params.push(`%${title}%`);
    }
    
    if (category_id) {
      query += ' AND c.category_id = ?';
      params.push(parseInt(category_id));
    }
    
    if (credits) {
      query += ' AND c.credits = ?';
      params.push(parseInt(credits));
    }
    
    query += ' ORDER BY c.code';
    
    const [rows] = await pool.query(query, params);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error searching courses:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while searching courses',
      error: error.message
    });
  }
};

/**
 * Get course categories
 * @route GET /api/courses/categories
 * @access Public
 */
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM course_categories
      ORDER BY name
    `);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching course categories:', error.message);
    res.status(500).json({
      success: false,  
      message: 'Server error while fetching course categories',
      error: error.message
    });
  }
};

/**
 * Get course enrollment status
 * @route GET /api/courses/:id/enrollment
 * @access Public
 */
const getCourseEnrollment = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Check if course exists
    const [course] = await pool.query(
      'SELECT * FROM courses WHERE id = ? AND active = TRUE',
      [courseId]
    );
    
    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Course with ID ${courseId} not found or inactive`
      });
    }
    
    // Get enrollment count
    const [enrollment] = await pool.query(`
      SELECT COUNT(*) as registered_students
      FROM registrations
      WHERE course_id = ?
    `, [courseId]);
    
    const registeredStudents = enrollment[0].registered_students;
    const maxCapacity = course[0].max_capacity;
    const availableSeats = maxCapacity - registeredStudents;
    
    res.status(200).json({
      success: true,
      data: {
        course_id: parseInt(courseId),
        course_code: course[0].code,
        course_title: course[0].title,
        max_capacity: maxCapacity,
        registered_students: registeredStudents,
        available_seats: availableSeats,
        is_full: availableSeats <= 0
      }
    });
  } catch (error) {
    console.error(`Error fetching enrollment for course ID ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course enrollment',
      error: error.message
    });
  }
};

/**
 * Get all available courses for registration
 * @route GET /api/courses/available
 * @access Public
 */
const getAvailableCourses = async (req, res) => {
  try {
    // Get the active term ID from query parameter, or use the current active term
    const { termId } = req.query;
    
    let query = `
      SELECT co.id as offering_id, c.id as course_id, c.course_code as code, c.title, 
             c.course_description as description, c.credits, cc.name as category_name,
             co.section_number, co.max_enrollment, co.current_enrollment,
             at.term_name as term_name, at.id as term_id,
             (co.max_enrollment - co.current_enrollment) as available_seats,
             GROUP_CONCAT(DISTINCT cl.building) as building, 
             GROUP_CONCAT(DISTINCT cl.room_number) as room_number,
             GROUP_CONCAT(DISTINCT p.full_name) as professor_name,
             GROUP_CONCAT(DISTINCT ts.day_of_week) as day_of_week, 
             MIN(ts.start_time) as start_time, 
             MAX(ts.end_time) as end_time
      FROM course_offerings co
      JOIN courses c ON co.course_id = c.id
      JOIN academic_terms at ON co.term_id = at.id
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN course_schedules cs ON cs.course_offering_id = co.id
      LEFT JOIN classrooms cl ON cs.classroom_id = cl.id
      LEFT JOIN professors p ON cs.professor_id = p.id
      LEFT JOIN timetable_slots ts ON cs.timetable_slot_id = ts.id
      WHERE c.active = TRUE
    `;
    
    const queryParams = [];
      // Filter by term if provided
    if (termId) {
      query += ` AND at.id = ?`;
      queryParams.push(termId);
    } else {
      // Get current active term (where current date is between term dates)
      query += ` AND CURRENT_DATE() BETWEEN at.registration_start AND at.registration_end`;
    }
    
    // Group by offering to avoid duplicates from multiple schedule entries
    query += ` GROUP BY co.id`;
    
    // Order by course code
    query += ` ORDER BY c.course_code, co.section_number`;
    
    const [rows] = await pool.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching available courses:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available courses',
      error: error.message
    });
  }
};

/**
 * Get all available courses for registration in a specified semester
 * @route GET /api/courses/available-by-semester
 * @access Public
 */
const getAvailableCoursesBySemester = async (req, res) => {
  try {
    // Get the semester ID from query parameter
    const { semesterId } = req.query;
    
    if (!semesterId) {
      return res.status(400).json({
        success: false,
        message: 'Semester ID is required'
      });
    }

    // Get term information first
    const [termInfo] = await pool.query(
      'SELECT * FROM academic_terms WHERE id = ?',
      [semesterId]
    );
    
    if (termInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Term not found'
      });
    }

    // Query to get all available courses for the specified semester with enhanced details
    const [courseOfferings] = await pool.query(`
      SELECT 
        co.id as offering_id, 
        c.id as course_id, 
        c.course_code, 
        c.title, 
        c.course_description, 
        c.credits, 
        cc.name as category_name,
        c.max_capacity,
        co.section_number, 
        co.max_enrollment, 
        co.current_enrollment,
        at.term_name, 
        at.id as term_id,
        at.start_date,
        at.end_date,
        at.registration_start,
        at.registration_end,
        (co.max_enrollment - co.current_enrollment) as available_seats,
        GROUP_CONCAT(DISTINCT cl.building SEPARATOR ', ') as building, 
        GROUP_CONCAT(DISTINCT cl.room_number SEPARATOR ', ') as room_number,
        GROUP_CONCAT(DISTINCT p.full_name SEPARATOR ', ') as professor_name,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            ts.day_of_week, ' (', 
            TIME_FORMAT(ts.start_time, '%H:%i'), ' - ', 
            TIME_FORMAT(ts.end_time, '%H:%i'), ')'
          ) 
          SEPARATOR '; '
        ) as schedule_details
      FROM course_offerings co
      JOIN courses c ON co.course_id = c.id
      JOIN academic_terms at ON co.term_id = at.id
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN course_schedules cs ON cs.course_offering_id = co.id
      LEFT JOIN classrooms cl ON cs.classroom_id = cl.id
      LEFT JOIN professors p ON cs.professor_id = p.id
      LEFT JOIN timetable_slots ts ON cs.timetable_slot_id = ts.id      WHERE c.active = TRUE AND at.id = ?
      GROUP BY co.id
      ORDER BY c.course_code, co.section_number
    `, [semesterId]);

    // Process course offerings with proper error handling
    const processedOfferings = [];
    
    for (const offering of courseOfferings) {
      const enhancedOffering = { ...offering };
      
      try {
        // Get prerequisite courses if any
        const [prerequisites] = await pool.query(`
          SELECT 
            cp.id as prerequisite_id,
            c.course_code, 
            c.title,
            c.credits
          FROM course_prerequisites cp
          JOIN courses c ON cp.prerequisite_course_id = c.id
          WHERE cp.course_id = ?
        `, [offering.course_id]);
        
        if (prerequisites.length > 0) {
          enhancedOffering.prerequisites = prerequisites;
        }
      } catch (error) {
        console.error(`Error fetching prerequisites for course ${offering.course_id}:`, error.message);
      }
      
      // Check for current registration status if user is logged in
      if (req.user && req.user.id) {
        try {
          const [registration] = await pool.query(`
            SELECT r.id, r.registration_status, r.registration_date
            FROM registrations r
            JOIN course_offerings co ON r.course_offering_id = co.id
            WHERE r.student_id = ? AND co.id = ?
          `, [req.user.id, offering.offering_id]);
          
          if (registration.length > 0) {
            enhancedOffering.registration_status = registration[0].registration_status;
            enhancedOffering.registration_id = registration[0].id;
            enhancedOffering.registration_date = registration[0].registration_date;
          }
        } catch (error) {
          console.error(`Error fetching registration status for student ${req.user.id}:`, error.message);
        }
      }
      
      processedOfferings.push(enhancedOffering);
    }
    
    // Create a more structured response with term details
    const currentDate = new Date();
    const formattedTerm = {
      id: termInfo[0].id,
      term_name: termInfo[0].term_name,
      period: `${new Date(termInfo[0].start_date).toLocaleDateString()} - ${new Date(termInfo[0].end_date).toLocaleDateString()}`,
      registration_period: `${new Date(termInfo[0].registration_start).toLocaleDateString()} - ${new Date(termInfo[0].registration_end).toLocaleDateString()}`,
      start_date: termInfo[0].start_date,
      end_date: termInfo[0].end_date,
      registration_start: termInfo[0].registration_start,
      registration_end: termInfo[0].registration_end,
      is_registration_active: 
        currentDate >= new Date(termInfo[0].registration_start) && 
        currentDate <= new Date(termInfo[0].registration_end),
      is_term_current:
        currentDate >= new Date(termInfo[0].start_date) && 
        currentDate <= new Date(termInfo[0].end_date)
    };
    
    // Get total students registered for this term
    const [registrationCount] = await pool.query(`
      SELECT COUNT(DISTINCT r.student_id) as total_students
      FROM registrations r
      JOIN course_offerings co ON r.course_offering_id = co.id
      WHERE co.term_id = ?
    `, [semesterId]);
    
    const result = {
      term: formattedTerm,
      courses: processedOfferings,
      total_courses: processedOfferings.length,
      total_registered_students: registrationCount[0].total_students || 0
    };
    
    res.status(200).json({
      success: true,
      count: processedOfferings.length,
      data: result
    });
  } catch (error) {
    console.error('Error fetching available courses by semester:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all academic terms (both active and inactive)
 * @route GET /api/courses/terms
 * @access Public
 */
const getActiveTerms = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM academic_terms
      ORDER BY start_date DESC
    `);
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching academic terms:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching academic terms',
      error: error.message
    });
  }
};

/**
 * Get curriculum framework (chương trình khung) by major
 * @route GET /api/courses/curriculum
 * @access Public
 */
const getCurriculumFramework = async (req, res) => {
  try {
    // Get program ID from query parameters (now we're using program_id instead of major_id)
    const programId = parseInt(req.query.major_id || req.query.program_id || 1); // Default to 1 if not provided
    
    if (isNaN(programId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid program ID',
      });
    }
    
    // Get program information
    const [programRows] = await pool.query(
      'SELECT id, name, description FROM academic_programs WHERE id = ?',
      [programId]
    );
    
    if (programRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }
    
    const program = programRows[0];
    
    // Create a fake major structure based on program since we don't have a separate majors table
    const major = {
      id: program.id,
      name: program.name,
      code: program.name.substring(0, 3).toUpperCase(),
      description: program.description
    };
    
    // Get all courses for the program (since we don't have semesters table, we'll create fake semesters)
    const [coursesRows] = await pool.query(`
      SELECT c.id, c.course_code as code, c.title, c.course_description as description, 
             c.credits, cc.name as category_name, 1 as is_required
      FROM courses c
      LEFT JOIN course_categories cc ON c.category_id = cc.id
      WHERE c.active = TRUE
      ORDER BY c.course_code
    `);
    
    // Group courses into semesters (for demonstration, we'll create 8 semesters)
    const numberOfSemesters = 8;
    const coursesPerSemester = Math.ceil(coursesRows.length / numberOfSemesters);
    
    // Create semester structures
    const semesters = [];
    let totalCredits = 0;
    
    for (let i = 0; i < numberOfSemesters; i++) {
      const semesterCourses = coursesRows.slice(
        i * coursesPerSemester, 
        Math.min((i + 1) * coursesPerSemester, coursesRows.length)
      );
      
      if (semesterCourses.length === 0) continue;
      
      const semesterCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
      totalCredits += semesterCredits;
      
      semesters.push({
        id: i + 1,
        name: `Học kỳ ${i + 1}`,
        sequence: i + 1,
        credits: semesterCredits,
        courses: semesterCourses
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        major,
        program,
        totalCredits,
        semesters,
      },
    });
  } catch (error) {
    console.error('Error fetching curriculum framework:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching curriculum framework',
      error: error.message,
    });
  }
};

/**
 * Get list of all majors
 * @route GET /api/courses/majors
 * @access Public
 */
const getMajors = async (req, res) => {
  try {
    // Using academic_programs table since that appears to be the relevant one in your schema
    const [rows] = await pool.query(
      'SELECT id, name, description FROM academic_programs ORDER BY name'
    );
    
    // Transform the results to match the expected format
    const transformedData = rows.map(program => ({
      id: program.id,
      name: program.name,
      code: program.name.substring(0, 3).toUpperCase(), // Generate a code if not available
      description: program.description,
      program_id: program.id,
      program_name: program.name,
      program_code: program.name.substring(0, 3).toUpperCase() // Generate a code if not available
    }));
    
    res.status(200).json({
      success: true,
      count: transformedData.length,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching majors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching majors',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
  getCategories,
  getCourseEnrollment,
  getAvailableCourses,
  getActiveTerms,
  getAvailableCoursesBySemester,
  getCurriculumFramework,
  getMajors
};

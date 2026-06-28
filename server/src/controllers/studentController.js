const Student = require('../models/student');
const pool = require('../config/db');

// Controller methods for student operations
const studentController = {
    // Get all students
    getAllStudents: async (req, res) => {
        try {
            const students = await Student.find();
            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get student by ID
    getStudentById: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(student);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new student
    createStudent: async (req, res) => {
        try {
            const newStudent = new Student(req.body);
            const savedStudent = await newStudent.save();
            res.status(201).json(savedStudent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update student
    updateStudent: async (req, res) => {
        try {
            const updatedStudent = await Student.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete student
    deleteStudent: async (req, res) => {
        try {
            const deletedStudent = await Student.findByIdAndDelete(req.params.id);
            if (!deletedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Enroll student in a course
    enrollCourse: async (req, res) => {
        try {
            const { courseId } = req.body;
            const student = await Student.findById(req.params.id);
            
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            if (student.courses.includes(courseId)) {
                return res.status(400).json({ message: 'Student already enrolled in this course' });
            }

            student.courses.push(courseId);
            await student.save();
            
            res.status(200).json(student);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Withdraw from a course
    withdrawCourse: async (req, res) => {
        try {
            const { courseId } = req.body;
            const student = await Student.findById(req.params.id);
            
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            if (!student.courses.includes(courseId)) {
                return res.status(400).json({ message: 'Student not enrolled in this course' });
            }

            student.courses = student.courses.filter(id => id.toString() !== courseId);
            await student.save();
            
            res.status(200).json(student);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get student's enrolled courses
    getEnrolledCourses: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id).populate('courses');
            
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            
            res.status(200).json(student.courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all available courses for registration
    getAvailableCourses: async (req, res) => {
        try {
            // Get current term's active courses
            const [courses] = await pool.query(`
                SELECT c.*, cc.name as category_name 
                FROM courses c
                LEFT JOIN course_categories cc ON c.category_id = cc.id
                WHERE c.active = TRUE
                ORDER BY c.course_code
            `);
            
            res.status(200).json({
                success: true,
                count: courses.length,
                data: courses
            });
        } catch (error) {
            console.error('Error fetching available courses:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching available courses',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get student's registered courses
    getStudentCourses: async (req, res) => {
        try {
            const studentId = req.user.id;
            const { status, termId } = req.query; // Add query parameters for filtering
            
            // Start building the query with base joins
            let query = `
                SELECT 
                    r.id as registration_id,
                    r.registration_date,
                    r.registration_status,
                    r.grade,
                    co.id as course_offering_id,
                    c.id as course_id,
                    c.course_code,
                    c.title as course_title,           -- <--- Alias for clarity
                    c.credits,
                    c.course_description,
                    cc.name as category_name,
                    at.id as term_id,
                    at.term_name,
                    at.academic_year,
                    co.section_number,
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'day', ts.day_of_week,
                            'start_time', ts.start_time,
                            'end_time', ts.end_time,
                            'room', CONCAT(cl.building, ' ', cl.room_number),
                            'professor', p.full_name
                        ) SEPARATOR '|'
                    ) as schedule_details
                FROM registrations r
                JOIN course_offerings co ON r.course_offering_id = co.id
                JOIN courses c ON co.course_id = c.id
                JOIN academic_terms at ON co.term_id = at.id
                LEFT JOIN course_categories cc ON c.category_id = cc.id
                LEFT JOIN course_schedules cs ON co.id = cs.course_offering_id
                LEFT JOIN timetable_slots ts ON cs.timetable_slot_id = ts.id
                LEFT JOIN classrooms cl ON cs.classroom_id = cl.id
                LEFT JOIN professors p ON cs.professor_id = p.id
                WHERE r.student_id = ?
                GROUP BY r.id
                ORDER BY c.course_code
            `;
            
            const queryParams = [studentId];
            
            // Add filters for registration status if provided
            if (status) {
                query += " AND r.registration_status = ?";
                queryParams.push(status);
            } else {
                // By default, show only active registrations (enrolled, waitlisted)
                query += " AND r.registration_status IN ('enrolled', 'waitlisted')";
            }
            
            // Add term filter if provided
            if (termId) {
                query += " AND at.id = ?";
                queryParams.push(termId);
            }
            
            // Group by registration to consolidate schedule info
            query += " GROUP BY r.id ORDER BY c.course_code";
            
            const [registrations] = await pool.query(query, queryParams);
            
            // Process the schedule_details string to convert it to a proper array of objects
            const processedRegistrations = registrations.map(reg => {
                let scheduleArray = [];
                if (reg.schedule_details) {
                    scheduleArray = reg.schedule_details.split('|').map(item => JSON.parse(item));
                }
                
                return {
                    ...reg,
                    schedule_details: scheduleArray
                };
            });
            
            res.status(200).json({
                success: true,
                count: processedRegistrations.length,
                data: processedRegistrations
            });
        } catch (error) {
            console.error('Error fetching student courses:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching student courses',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Register for a course
    registerForCourse: async (req, res) => {
        try {
            const studentId = req.user.id;
            const courseId = req.params.courseId;
            
            // Check if course exists and is active
            const [course] = await pool.query(
                'SELECT * FROM courses WHERE id = ? AND active = TRUE',
                [courseId]
            );
            
            if (course.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found or inactive'
                });
            }
            
            // Check if student is already registered for this course
            const [existingReg] = await pool.query(`
                SELECT * FROM registrations r
                JOIN course_offerings co ON r.course_offering_id = co.id
                WHERE r.student_id = ? AND co.course_id = ? AND r.registration_status = 'enrolled'
            `, [studentId, courseId]);
            
            if (existingReg.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already registered for this course'
                });
            }
            
            // Check if course has available spots
            const [courseOffering] = await pool.query(
                'SELECT * FROM course_offerings WHERE course_id = ? AND current_enrollment < max_enrollment',
                [courseId]
            );
            
            if (courseOffering.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No available spots in this course'
                });
            }
            
            // Register student
            const [result] = await pool.query(
                'INSERT INTO registrations (student_id, course_offering_id) VALUES (?, ?)',
                [studentId, courseOffering[0].id]
            );
            
            // Update enrollment count
            await pool.query(
                'UPDATE course_offerings SET current_enrollment = current_enrollment + 1 WHERE id = ?',
                [courseOffering[0].id]
            );
            
            res.status(201).json({
                success: true,
                message: 'Successfully registered for course',
                data: {
                    registration_id: result.insertId,
                    course_code: course[0].course_code,
                    course_title: course[0].title
                }
            });
        } catch (error) {
            console.error('Error registering for course:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while registering for course',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

        // …existing code…
    dropRegistration: async (req, res) => {
      try {
        const registrationId = req.params.id;
        const studentId = req.user.id;
    
        // 1) fetch the registration + offering
        const [rows] = await pool.query(`
          SELECT 
            r.registration_status, 
            co.id AS offeringId 
          FROM registrations r
          JOIN course_offerings co ON r.course_offering_id = co.id
          WHERE r.id = ? AND r.student_id = ?
        `, [registrationId, studentId]);
    
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Registration not found.' });
        }
    
        const { registration_status, offeringId } = rows[0];
        if (registration_status !== 'enrolled') {
          return res.status(400).json({ success: false, message: 'Only enrolled courses can be dropped.' });
        }
    
        // 2) update status → dropped
        await pool.query(
          'UPDATE registrations SET registration_status = "dropped" WHERE id = ?',
          [registrationId]
        );
    
        // 3) decrement enrollment
        await pool.query(
          'UPDATE course_offerings SET current_enrollment = current_enrollment - 1 WHERE id = ?',
          [offeringId]
        );
    
        res.json({ success: true, message: 'Course dropped successfully.' });
      } catch (err) {
        console.error('dropRegistration error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
      }
    },
    // …existing code…

    // Get student profile
    getStudentProfile: async (req, res) => {
        try {
            const studentId = req.user.id;
            
            const [student] = await pool.query(`
                SELECT s.id, s.username, s.student_id, s.email, s.full_name, 
                s.date_of_birth, s.class, s.enrollment_date, s.created_at,
                p.name as program_name, p.description as program_description
                FROM students s
                JOIN academic_programs p ON s.program_id = p.id
                WHERE s.id = ?
            `, [studentId]);
            
            if (student.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }
            
            res.status(200).json({
                success: true,
                data: student[0]
            });
        } catch (error) {
            console.error('Error fetching student profile:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching student profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Update student profile
    updateStudentProfile: async (req, res) => {
        try {
            const studentId = req.user.id;
            const { email, full_name, date_of_birth, class: className } = req.body;
            
            // Build update query
            const updateFields = [];
            const updateValues = [];
            
            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }
            
            if (full_name) {
                updateFields.push('full_name = ?');
                updateValues.push(full_name);
            }
            
            if (date_of_birth) {
                updateFields.push('date_of_birth = ?');
                updateValues.push(date_of_birth);
            }
            
            if (className) {
                updateFields.push('class = ?');
                updateValues.push(className);
            }
            
            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No fields provided for update'
                });
            }
            
            // Add student ID to values
            updateValues.push(studentId);
            
            // Execute update
            const query = `
                UPDATE students 
                SET ${updateFields.join(', ')}
                WHERE id = ?
            `;
            
            await pool.query(query, updateValues);
            
            // Get updated profile
            const [updatedStudent] = await pool.query(`
                SELECT s.id, s.username, s.student_id, s.email, s.full_name, 
                s.date_of_birth, s.class, s.enrollment_date, s.created_at,
                p.name as program_name, p.description as program_description
                FROM students s
                JOIN academic_programs p ON s.program_id = p.id
                WHERE s.id = ?
            `, [studentId]);
            
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedStudent[0]
            });
        } catch (error) {
            console.error('Error updating student profile:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while updating student profile',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get registration history
    getRegistrationHistory: async (req, res) => {
        try {
            const studentId = req.user.id;
            
            const [registrations] = await pool.query(`
                SELECT 
                    r.id AS registration_id,
                    r.registration_date,
                    r.registration_status,
                    r.grade,
                    r.course_offering_id,
                    c.id AS course_id,
                    c.course_code,
                    c.title AS course_title,         -- <--- Alias for clarity
                    c.credits,
                    c.course_description,
                    cc.name AS category_name,
                    at.term_name
                FROM registrations r
                JOIN course_offerings co ON r.course_offering_id = co.id
                JOIN courses c ON co.course_id = c.id
                JOIN academic_terms at ON co.term_id = at.id
                LEFT JOIN course_categories cc ON c.category_id = cc.id
                WHERE r.student_id = ?
                ORDER BY r.registration_date DESC
            `, [studentId]);
            
            res.status(200).json({
                success: true,
                count: registrations.length,
                data: registrations
            });
        } catch (error) {
            console.error('Error fetching registration history:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching registration history',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get student's daily schedule
    getDailySchedule: async (req, res) => {
        try {
            const { date } = req.query;
            const studentId = req.user.id;
            
            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: 'Date parameter is required (YYYY-MM-DD format)'
                });
            }
            
            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Please use YYYY-MM-DD format'
                });
            }

            // Get the day of week for the given date (0=Sunday, 1=Monday, ... 6=Saturday)
            const dayOfWeek = new Date(date).getDay();

            // Query the joined tables for the student's schedule on the given date
            const [schedules] = await pool.query(`
                SELECT 
                    scs.id,
                    ts.start_time,
                    ts.end_time,
                    c.course_code AS subject_code,
                    c.title AS subject_name,
                    CONCAT(cl.building, ' ', cl.room_number) AS room,
                    p.full_name AS teacher
                FROM student_class_schedule scs
                JOIN course_offerings co ON scs.course_offering_id = co.id
                JOIN courses c ON co.course_id = c.id
                JOIN timetable_slots ts ON scs.timetable_slot_id = ts.id
                JOIN classrooms cl ON scs.classroom_id = cl.id
                JOIN course_schedules cs 
                    ON scs.course_offering_id = cs.course_offering_id
                    AND scs.timetable_slot_id = cs.timetable_slot_id
                    AND scs.classroom_id = cs.classroom_id
                LEFT JOIN professors p ON cs.professor_id = p.id
                WHERE scs.student_id = ?
                  AND ? BETWEEN scs.start_date AND scs.end_date
                  AND ts.day_of_week = ?
                  AND scs.status = 'registered'
                ORDER BY ts.start_time ASC
            `, [studentId, date, dayOfWeek]);
            
            res.status(200).json({
                success: true,
                count: schedules.length,
                data: schedules
            });
        } catch (error) {
            console.error('Error fetching daily schedule:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching daily schedule',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Get schedule for a specific course registration
    getCourseSchedule: async (req, res) => {
        try {
            const studentId = req.user.id;
            const registrationId = req.params.registrationId;

            // Verify that the registration belongs to the student
            const [registration] = await pool.query(`
                SELECT r.* FROM registrations r
                WHERE r.id = ? AND r.student_id = ?
            `, [registrationId, studentId]);

            if (registration.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Registration not found or does not belong to you'
                });
            }

            // Get the course schedule for this registration
            const [schedules] = await pool.query(`
                SELECT 
                    cs.id,
                    ts.start_time as startTime,
                    ts.end_time as endTime,
                    c.course_code as subjectCode,
                    c.title as subjectName,
                    CONCAT(cl.building, ' ', cl.room_number) as room,
                    p.full_name as teacher,
                    cl.building,
                    cl.id as classroom_id,
                    ts.day_of_week as dayOfWeek
                FROM course_schedules cs
                JOIN course_offerings co ON cs.course_offering_id = co.id
                JOIN courses c ON co.course_id = c.id
                JOIN classrooms cl ON cs.classroom_id = cl.id
                JOIN professors p ON cs.professor_id = p.id
                JOIN timetable_slots ts ON cs.timetable_slot_id = ts.id
                WHERE co.id = ? 
                ORDER BY ts.day_of_week, ts.start_time ASC
            `, [registration[0].course_offering_id]);
            
            res.status(200).json({
                success: true,
                count: schedules.length,
                data: schedules
            });
        } catch (error) {
            console.error('Error fetching course schedule:', error.message);
            res.status(500).json({ 
                success: false,
                message: 'Server error while fetching course schedule',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
};

module.exports = studentController;
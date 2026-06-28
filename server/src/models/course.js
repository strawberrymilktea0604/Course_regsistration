const db = require('../config/db');

class Course {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM courses');
      return rows;
    } catch (error) {
      console.error('Error finding all courses:', error);
      throw error;
    }
  }
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error finding course with id ${id}:`, error);
      throw error;
    }
  }
  static async create(courseData) {
    try {
      const { title, description, credits, capacity } = courseData;
      const [result] = await db.query(
        'INSERT INTO courses (title, description, credits, capacity) VALUES (?, ?, ?, ?)',
        [title, description, credits, capacity]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating new course:', error);
      throw error;
    }
  }
  // Add update and delete methods similarly
    static async update(id, courseData) {
      try {
        const { title, description, credits, capacity } = courseData;
        await db.query(
          'UPDATE courses SET title = ?, description = ?, credits = ?, capacity = ? WHERE id = ?',
          [title, description, credits, capacity, id]
        );
        return id;
      } catch (error) {
        console.error(`Error updating course with id ${id}:`, error);
        throw error;
      }
    }
  static async delete(id) {
    try {
      await db.query('DELETE FROM courses WHERE id = ?', [id]);
      return id;
    } catch (error) {
      console.error(`Error deleting course with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = Course;
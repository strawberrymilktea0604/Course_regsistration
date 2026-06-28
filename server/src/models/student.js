const { EntitySchema } = require('typeorm');
const bcrypt = require('bcrypt');

module.exports = new EntitySchema({
  name: 'Student',
  tableName: 'students',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar',
      length: 50,
      nullable: false,
      unique: true
    },
    password_student: {  // Changed from password to password_student
      type: 'varchar',
      length: 100,
      nullable: false
    },
    student_id: {  // Added university ID field
      type: 'varchar',
      length: 20,
      nullable: false,
      unique: true
    },
    email: {
      type: 'varchar',
      length: 100,
      nullable: false,
      unique: true
    },
    full_name: {  // Changed from name to full_name
      type: 'varchar',
      length: 100,
      nullable: false
    },
    date_of_birth: {  // Changed from dateOfBirth to date_of_birth
      type: 'date',
      nullable: true
    },
    class: {
      type: 'varchar',
      length: 10,
      nullable: true
    },
    program_id: {  // Added program_id field
      type: 'int',
      nullable: false
    },
    enrollment_date: {  // Added enrollment_date field
      type: 'date',
      nullable: false
    },
    created_at: {  // Changed from createdAt to created_at
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    last_login: {  // Added last_login field
      type: 'timestamp',
      nullable: true
    }
  },
  relations: {
    registrations: {
      type: 'one-to-many',
      target: 'registrations',
      inverseSide: 'student'
    },
    program: {  // Added relation to academic_programs
      type: 'many-to-one',
      target: 'academic_programs',
      joinColumn: {
        name: 'program_id'
      }
    }
  },
  indices: [
    {
      name: 'idx_student_username',
      columns: ['username']
    },
    {
      name: 'idx_student_id',
      columns: ['student_id']
    }
  ]
});
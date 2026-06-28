const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Registration',
  tableName: 'registrations',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    registrationDate: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    status: {
      type: 'varchar',
      length: 20,
      default: 'pending'
    }
  },
  relations: {
    student: {
      type: 'many-to-one',
      target: 'Student',
      joinColumn: {
        name: 'studentId'
      },
      onDelete: 'CASCADE'
    },
    course: {
      type: 'many-to-one',
      target: 'Course',
      joinColumn: {
        name: 'courseId'
      },
      onDelete: 'CASCADE'
    }
  }
});

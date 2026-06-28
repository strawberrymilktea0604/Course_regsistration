const { EntitySchema } = require('typeorm');
const bcrypt = require('bcrypt');

module.exports = new EntitySchema({
  name: 'Admin',
  tableName: 'admins',
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
    password: {
      type: 'varchar',
      length: 100,
      nullable: false
    },
    email: {
      type: 'varchar',
      length: 100,
      nullable: false,
      unique: true
    },
    fullName: {
      type: 'varchar',
      length: 100,
      nullable: false
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  },
  indices: [
    {
      name: 'idx_admin_username',
      columns: ['username']
    }
  ]
});

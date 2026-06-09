'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'validator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
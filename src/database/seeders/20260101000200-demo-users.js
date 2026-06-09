'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        role_id: 1,
        nickname: 'admin',
        email: 'admin@fotaza.com',
        password_hash: password,
        biography: 'Administrador general de Fotaza.',
        profile_image_url: null,
        is_active: true,
        banned_publications_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 2,
        nickname: 'validador',
        email: 'validador@fotaza.com',
        password_hash: password,
        biography: 'Usuario encargado de validar contenidos denunciados.',
        profile_image_url: null,
        is_active: true,
        banned_publications_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 3,
        nickname: 'jonathan',
        email: 'jonathan@fotaza.com',
        password_hash: password,
        biography: 'Fotógrafo aficionado de paisajes urbanos.',
        profile_image_url: null,
        is_active: true,
        banned_publications_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: 3,
        nickname: 'camila',
        email: 'camila@fotaza.com',
        password_hash: password,
        biography: 'Fotógrafa interesada en retratos y naturaleza.',
        profile_image_url: null,
        is_active: true,
        banned_publications_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
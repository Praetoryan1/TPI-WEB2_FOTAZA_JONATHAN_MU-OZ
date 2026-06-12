'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('tags', [
      {
        id: 1,
        name: 'naturaleza',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        name: 'urbano',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        name: 'retrato',
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        name: 'viajes',
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('publications', [
      {
        id: 1,
        user_id: 3,
        title: 'Paisajes de prueba',
        description: 'Publicación demo para probar imágenes, comentarios y valoraciones.',
        status: 'active',
        is_edit_locked: false,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        user_id: 4,
        title: 'Ciudad y arquitectura',
        description: 'Publicación demo creada por Camila.',
        status: 'active',
        is_edit_locked: false,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        user_id: 3,
        title: 'Galería con copyright',
        description: 'Publicación demo con una imagen marcada con copyright.',
        status: 'active',
        is_edit_locked: false,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('images', [
      {
        id: 1,
        publication_id: 1,
        url: '/img/demo-photo-1.svg',
        alt_text: 'Imagen demo de paisaje',
        license: 'no_copyright',
        is_watermarked: false,
        watermark_text: null,
        comments_enabled: true,
        average_rating: 4.5,
        ratings_count: 2,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        publication_id: 2,
        url: '/img/demo-photo-2.svg',
        alt_text: 'Imagen demo urbana',
        license: 'no_copyright',
        is_watermarked: true,
        watermark_text: 'Fotaza',
        comments_enabled: true,
        average_rating: 5,
        ratings_count: 1,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        publication_id: 3,
        url: '/img/demo-photo-3.svg',
        alt_text: 'Imagen demo con copyright',
        license: 'copyright',
        is_watermarked: true,
        watermark_text: 'Autor protegido',
        comments_enabled: true,
        average_rating: 0,
        ratings_count: 0,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('publication_tags', [
      {
        publication_id: 1,
        tag_id: 1,
        created_at: now,
        updated_at: now
      },
      {
        publication_id: 1,
        tag_id: 4,
        created_at: now,
        updated_at: now
      },
      {
        publication_id: 2,
        tag_id: 2,
        created_at: now,
        updated_at: now
      },
      {
        publication_id: 3,
        tag_id: 3,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('comments', [
      {
        id: 1,
        image_id: 1,
        user_id: 4,
        content: 'Muy buena composición.',
        is_deleted: false,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        image_id: 2,
        user_id: 3,
        content: 'Me gusta el estilo urbano.',
        is_deleted: false,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        image_id: 2,
        user_id: 4,
        content: 'Comentario propio de Camila para probar denuncias.',
        is_deleted: false,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('ratings', [
      {
        image_id: 1,
        user_id: 4,
        value: 5,
        created_at: now,
        updated_at: now
      },
      {
        image_id: 1,
        user_id: 2,
        value: 4,
        created_at: now,
        updated_at: now
      },
      {
        image_id: 2,
        user_id: 3,
        value: 5,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('followers', [
      {
        follower_id: 3,
        followed_id: 4,
        created_at: now,
        updated_at: now
      },
      {
        follower_id: 4,
        followed_id: 3,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('collections', [
      {
        id: 1,
        user_id: 3,
        title: 'Favoritas Jonathan',
        description: 'Colección demo de Jonathan.',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        user_id: 4,
        title: 'Inspiración Camila',
        description: 'Colección demo de Camila.',
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('collection_publications', [
      {
        collection_id: 1,
        publication_id: 2,
        created_at: now,
        updated_at: now
      },
      {
        collection_id: 2,
        publication_id: 1,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('notifications', [
      {
        user_id: 3,
        actor_id: 4,
        type: 'follow',
        entity_type: 'user',
        entity_id: 4,
        message: 'Camila comenzó a seguirte.',
        is_read: false,
        created_at: now,
        updated_at: now
      },
      {
        user_id: 4,
        actor_id: 3,
        type: 'comment',
        entity_type: 'publication',
        entity_id: 2,
        message: 'Jonathan comentó una imagen de tu publicación.',
        is_read: false,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('notifications', null, {});
    await queryInterface.bulkDelete('collection_publications', null, {});
    await queryInterface.bulkDelete('collections', null, {});
    await queryInterface.bulkDelete('followers', null, {});
    await queryInterface.bulkDelete('ratings', null, {});
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('publication_tags', null, {});
    await queryInterface.bulkDelete('images', null, {});
    await queryInterface.bulkDelete('publications', null, {});
    await queryInterface.bulkDelete('tags', null, {});
  }
};
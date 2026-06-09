'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      publication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publications',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      storage_public_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      alt_text: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      license: {
        type: Sequelize.ENUM('copyright', 'no_copyright'),
        allowNull: false,
        defaultValue: 'no_copyright'
      },
      watermark_text: {
        type: Sequelize.STRING(120),
        allowNull: true
      },
      is_watermarked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      comments_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      order_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      average_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0
      },
      ratings_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('images', ['publication_id'], {
      name: 'images_publication_id_index'
    });

    await queryInterface.addIndex('images', ['license'], {
      name: 'images_license_index'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('images');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('image_reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'images',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reason_type: {
        type: Sequelize.ENUM(
          'inappropriate',
          'copyright',
          'offensive',
          'spam',
          'other'
        ),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'dismissed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('image_reports', ['image_id'], {
      name: 'image_reports_image_id_index'
    });

    await queryInterface.addIndex('image_reports', ['user_id'], {
      name: 'image_reports_user_id_index'
    });

    await queryInterface.addIndex('image_reports', ['status'], {
      name: 'image_reports_status_index'
    });

    await queryInterface.addIndex('image_reports', ['image_id', 'user_id'], {
      unique: true,
      name: 'image_reports_image_user_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('image_reports');
  }
};
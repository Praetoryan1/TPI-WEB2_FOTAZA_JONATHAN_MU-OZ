'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      type: {
        type: Sequelize.ENUM('comment', 'rating', 'follow', 'interest', 'message', 'report'),
        allowNull: false
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      message: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    await queryInterface.addIndex('notifications', ['user_id'], {
      name: 'notifications_user_id_index'
    });

    await queryInterface.addIndex('notifications', ['actor_id'], {
      name: 'notifications_actor_id_index'
    });

    await queryInterface.addIndex('notifications', ['is_read'], {
      name: 'notifications_is_read_index'
    });

    await queryInterface.addIndex('notifications', ['type'], {
      name: 'notifications_type_index'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
  }
};
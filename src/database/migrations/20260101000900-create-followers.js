'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('followers', {
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      followed_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('followers', ['follower_id'], {
      name: 'followers_follower_id_index'
    });

    await queryInterface.addIndex('followers', ['followed_id'], {
      name: 'followers_followed_id_index'
    });

    await queryInterface.addIndex('followers', ['follower_id', 'followed_id'], {
      unique: true,
      name: 'followers_unique_relation'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('followers');
  }
};
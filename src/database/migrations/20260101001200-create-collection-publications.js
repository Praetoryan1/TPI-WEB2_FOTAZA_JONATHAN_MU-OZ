'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('collection_publications', {
      collection_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'collections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      publication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'publications',
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

    await queryInterface.addIndex('collection_publications', ['collection_id'], {
      name: 'collection_publications_collection_id_index'
    });

    await queryInterface.addIndex('collection_publications', ['publication_id'], {
      name: 'collection_publications_publication_id_index'
    });

    await queryInterface.addIndex('collection_publications', ['collection_id', 'publication_id'], {
      unique: true,
      name: 'collection_publications_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('collection_publications');
  }
};
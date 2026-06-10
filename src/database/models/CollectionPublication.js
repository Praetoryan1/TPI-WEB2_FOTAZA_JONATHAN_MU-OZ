const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class CollectionPublication extends Model {}

  CollectionPublication.init(
    {
      collection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      publication_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'CollectionPublication',
      tableName: 'collection_publications',
      underscored: true,
      timestamps: true
    }
  );

  return CollectionPublication;
};
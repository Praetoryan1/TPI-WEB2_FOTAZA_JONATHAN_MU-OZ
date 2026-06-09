const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class PublicationTag extends Model {}

  PublicationTag.init(
    {
      publication_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'PublicationTag',
      tableName: 'publication_tags',
      underscored: true,
      timestamps: true
    }
  );

  return PublicationTag;
};
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Publication, {
        through: models.PublicationTag,
        foreignKey: 'tag_id',
        otherKey: 'publication_id',
        as: 'publications'
      });
    }
  }

  Tag.init(
    {
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'tags',
      underscored: true,
      timestamps: true
    }
  );

  return Tag;
};
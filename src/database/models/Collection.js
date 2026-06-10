const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Collection extends Model {
    static associate(models) {
      Collection.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'owner'
      });

      Collection.belongsToMany(models.Publication, {
        through: models.CollectionPublication,
        foreignKey: 'collection_id',
        otherKey: 'publication_id',
        as: 'publications'
      });
    }
  }

  Collection.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Collection',
      tableName: 'collections',
      underscored: true,
      timestamps: true
    }
  );

  return Collection;
};
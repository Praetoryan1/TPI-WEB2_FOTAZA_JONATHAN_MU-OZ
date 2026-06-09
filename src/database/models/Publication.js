const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Publication extends Model {
    static associate(models) {
      Publication.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author'
      });

      Publication.hasMany(models.Image, {
        foreignKey: 'publication_id',
        as: 'images'
      });

      Publication.belongsToMany(models.Tag, {
        through: models.PublicationTag,
        foreignKey: 'publication_id',
        otherKey: 'tag_id',
        as: 'tags'
      });
    }
  }

  Publication.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'under_review', 'disabled'),
        allowNull: false,
        defaultValue: 'active'
      },
      is_edit_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Publication',
      tableName: 'publications',
      underscored: true,
      timestamps: true
    }
  );

  return Publication;
};
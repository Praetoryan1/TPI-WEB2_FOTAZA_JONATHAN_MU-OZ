const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Image, {
        foreignKey: 'image_id',
        as: 'image'
      });

      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author'
      });
    }
  }

  Comment.init(
    {
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'comments',
      underscored: true,
      timestamps: true
    }
  );

  return Comment;
};
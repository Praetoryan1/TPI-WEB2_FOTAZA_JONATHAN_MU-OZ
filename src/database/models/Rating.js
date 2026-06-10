const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.Image, {
        foreignKey: 'image_id',
        as: 'image'
      });

      Rating.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Rating.init(
    {
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      value: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      }
    },
    {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      underscored: true,
      timestamps: true
    }
  );

  return Rating;
};
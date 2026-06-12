const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class InterestRequest extends Model {
    static associate(models) {
      InterestRequest.belongsTo(models.Image, {
        foreignKey: 'image_id',
        as: 'image'
      });

      InterestRequest.belongsTo(models.User, {
        foreignKey: 'buyer_id',
        as: 'buyer'
      });

      InterestRequest.belongsTo(models.User, {
        foreignKey: 'author_id',
        as: 'author'
      });

      InterestRequest.hasOne(models.Conversation, {
        foreignKey: 'interest_request_id',
        as: 'conversation'
      });
    }
  }

  InterestRequest.init(
    {
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'closed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'InterestRequest',
      tableName: 'interest_requests',
      underscored: true,
      timestamps: true
    }
  );

  return InterestRequest;
};
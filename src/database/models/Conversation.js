const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.InterestRequest, {
        foreignKey: 'interest_request_id',
        as: 'interestRequest'
      });

      Conversation.belongsTo(models.Image, {
        foreignKey: 'image_id',
        as: 'image'
      });

      Conversation.belongsTo(models.User, {
        foreignKey: 'buyer_id',
        as: 'buyer'
      });

      Conversation.belongsTo(models.User, {
        foreignKey: 'seller_id',
        as: 'seller'
      });

      Conversation.hasMany(models.Message, {
        foreignKey: 'conversation_id',
        as: 'messages'
      });
    }
  }

  Conversation.init(
    {
      interest_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      buyer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seller_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations',
      underscored: true,
      timestamps: true
    }
  );

  return Conversation;
};
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversation_id',
        as: 'conversation'
      });

      Message.belongsTo(models.User, {
        foreignKey: 'sender_id',
        as: 'sender'
      });
    }
  }

  Message.init(
    {
      conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      underscored: true,
      timestamps: true
    }
  );

  return Message;
};
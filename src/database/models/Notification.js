const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'recipient'
      });

      Notification.belongsTo(models.User, {
        foreignKey: 'actor_id',
        as: 'actor'
      });
    }
  }

  Notification.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      actor_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('comment', 'rating', 'follow', 'interest', 'message', 'report'),
        allowNull: false
      },
      entity_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      message: {
        type: DataTypes.STRING(255),
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
      modelName: 'Notification',
      tableName: 'notifications',
      underscored: true,
      timestamps: true
    }
  );

  return Notification;
};
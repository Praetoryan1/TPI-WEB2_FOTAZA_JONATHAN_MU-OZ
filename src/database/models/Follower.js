const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Follower extends Model {}

  Follower.init(
    {
      follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'Follower',
      tableName: 'followers',
      underscored: true,
      timestamps: true
    }
  );

  return Follower;
};
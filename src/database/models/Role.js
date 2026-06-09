const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
      });
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      underscored: true,
      timestamps: true
    }
  );

  return Role;
};
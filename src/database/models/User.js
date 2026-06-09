const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
    }
  }

  User.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      profile_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      banned_publications_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true
    }
  );

  return User;
};
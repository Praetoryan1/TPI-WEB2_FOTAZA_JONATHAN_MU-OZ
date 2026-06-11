const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class ImageReport extends Model {
    static associate(models) {
      ImageReport.belongsTo(models.Image, {
        foreignKey: 'image_id',
        as: 'image'
      });

      ImageReport.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'reporter'
      });

      ImageReport.belongsTo(models.User, {
        foreignKey: 'reviewed_by',
        as: 'reviewer'
      });
    }
  }

  ImageReport.init(
    {
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reason_type: {
        type: DataTypes.ENUM(
          'inappropriate',
          'copyright',
          'offensive',
          'spam',
          'other'
        ),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'dismissed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      reviewed_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'ImageReport',
      tableName: 'image_reports',
      underscored: true,
      timestamps: true
    }
  );

  return ImageReport;
};
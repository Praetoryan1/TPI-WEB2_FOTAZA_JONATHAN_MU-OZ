const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class CommentReport extends Model {
    static associate(models) {
      CommentReport.belongsTo(models.Comment, {
        foreignKey: 'comment_id',
        as: 'comment'
      });

      CommentReport.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'reporter'
      });

      CommentReport.belongsTo(models.User, {
        foreignKey: 'reviewed_by',
        as: 'reviewer'
      });
    }
  }

  CommentReport.init(
    {
      comment_id: {
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
          'offensive',
          'spam',
          'harassment',
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
      modelName: 'CommentReport',
      tableName: 'comment_reports',
      underscored: true,
      timestamps: true
    }
  );

  return CommentReport;
};
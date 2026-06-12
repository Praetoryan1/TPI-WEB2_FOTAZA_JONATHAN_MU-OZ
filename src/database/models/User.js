const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
       User.hasMany(models.Publication, {
    foreignKey: 'user_id',
    as: 'publications'
  });
  User.hasMany(models.Comment, {
    foreignKey: 'user_id',
    as: 'comments'
  });
  User.hasMany(models.Rating, {
  foreignKey: 'user_id',
  as: 'ratings'
});
User.belongsToMany(models.User, {
  through: models.Follower,
  foreignKey: 'follower_id',
  otherKey: 'followed_id',
  as: 'following'
});

User.belongsToMany(models.User, {
  through: models.Follower,
  foreignKey: 'followed_id',
  otherKey: 'follower_id',
  as: 'followers'
});

User.hasMany(models.Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});

User.hasMany(models.Notification, {
  foreignKey: 'actor_id',
  as: 'triggeredNotifications'
});

User.hasMany(models.Collection, {
  foreignKey: 'user_id',
  as: 'collections'
});

User.hasMany(models.ImageReport, {
  foreignKey: 'user_id',
  as: 'imageReports'
});

User.hasMany(models.ImageReport, {
  foreignKey: 'reviewed_by',
  as: 'reviewedImageReports'
});

User.hasMany(models.CommentReport, {
  foreignKey: 'user_id',
  as: 'commentReports'
});

User.hasMany(models.CommentReport, {
  foreignKey: 'reviewed_by',
  as: 'reviewedCommentReports'
});

User.hasMany(models.InterestRequest, {
  foreignKey: 'buyer_id',
  as: 'interestRequestsMade'
});

User.hasMany(models.InterestRequest, {
  foreignKey: 'author_id',
  as: 'interestRequestsReceived'
});

User.hasMany(models.Conversation, {
  foreignKey: 'buyer_id',
  as: 'buyerConversations'
});

User.hasMany(models.Conversation, {
  foreignKey: 'seller_id',
  as: 'sellerConversations'
});

User.hasMany(models.Message, {
  foreignKey: 'sender_id',
  as: 'sentMessages'
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
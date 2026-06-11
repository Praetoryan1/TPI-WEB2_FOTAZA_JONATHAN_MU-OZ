const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Publication, {
        foreignKey: 'publication_id',
        as: 'publication'
      });
        Image.hasMany(models.Comment, {
    foreignKey: 'image_id',
    as: 'comments'
  });
  Image.hasMany(models.Rating, {
    foreignKey: 'image_id',
    as: 'ratings'
  });
  Image.hasMany(models.ImageReport, {
  foreignKey: 'image_id',
  as: 'reports'
});
    }
  }

  Image.init(
    {
      publication_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      storage_public_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      alt_text: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      license: {
        type: DataTypes.ENUM('copyright', 'no_copyright'),
        allowNull: false,
        defaultValue: 'no_copyright'
      },
      watermark_text: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      is_watermarked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      comments_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      order_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0
      },
      ratings_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Image',
      tableName: 'images',
      underscored: true,
      timestamps: true
    }
  );

  return Image;
};
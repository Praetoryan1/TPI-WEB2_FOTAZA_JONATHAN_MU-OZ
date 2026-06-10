const {
  sequelize,
  Rating,
  Image,
  Publication
} = require('../../database/models');

const getImageWithPublication = async (imageId) => {
  return Image.findByPk(imageId, {
    include: [
      {
        model: Publication,
        as: 'publication'
      }
    ]
  });
};

const recalculateImageRating = async (imageId, transaction) => {
  const ratingStats = await Rating.findAll({
    where: {
      image_id: imageId
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'ratings_count'],
      [sequelize.fn('AVG', sequelize.col('value')), 'average_rating']
    ],
    raw: true,
    transaction
  });

  const stats = ratingStats[0];

  const ratingsCount = Number(stats.ratings_count) || 0;
  const averageRating = Number(stats.average_rating) || 0;

  await Image.update(
    {
      ratings_count: ratingsCount,
      average_rating: averageRating.toFixed(2)
    },
    {
      where: {
        id: imageId
      },
      transaction
    }
  );
};

const rateImage = async ({ imageId, userId, value }) => {
  return sequelize.transaction(async (transaction) => {
    const image = await getImageWithPublication(imageId);

    if (!image) {
      throw new Error('La imagen no existe.');
    }

    if (!image.publication || image.publication.status !== 'active') {
      throw new Error('La publicación no se encuentra disponible para valorar.');
    }

    if (Number(image.publication.user_id) === Number(userId)) {
      throw new Error('No podés valorar una imagen propia.');
    }

    const existingRating = await Rating.findOne({
      where: {
        image_id: image.id,
        user_id: userId
      },
      transaction
    });

    if (existingRating) {
      throw new Error('Ya valoraste esta imagen.');
    }

    await Rating.create(
      {
        image_id: image.id,
        user_id: userId,
        value: Number(value)
      },
      { transaction }
    );

    await recalculateImageRating(image.id, transaction);

    return {
      publicationId: image.publication_id
    };
  });
};

module.exports = {
  rateImage
};
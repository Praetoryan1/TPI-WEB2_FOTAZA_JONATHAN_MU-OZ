const {
  sequelize,
  ImageReport,
  Image,
  Publication,
  User
} = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

const REPORT_THRESHOLD = 3;

const getImageWithPublication = async (imageId) => {
  return Image.findByPk(imageId, {
    include: [
      {
        model: Publication,
        as: 'publication',
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'nickname']
          }
        ]
      }
    ]
  });
};

const createImageReport = async ({
  imageId,
  userId,
  reasonType,
  description
}) => {
  return sequelize.transaction(async (transaction) => {
    const image = await getImageWithPublication(imageId);

    if (!image) {
      throw new Error('La imagen no existe.');
    }

    if (!image.publication || image.publication.status === 'disabled') {
      throw new Error('La publicación no se encuentra disponible.');
    }

    if (Number(image.publication.user_id) === Number(userId)) {
      throw new Error('No podés denunciar una imagen propia.');
    }

    const existingReport = await ImageReport.findOne({
      where: {
        image_id: image.id,
        user_id: userId
      },
      transaction
    });

    if (existingReport) {
      throw new Error('Ya denunciaste esta imagen.');
    }

    await ImageReport.create(
      {
        image_id: image.id,
        user_id: userId,
        reason_type: reasonType,
        description: description.trim(),
        status: 'pending'
      },
      { transaction }
    );

    await Publication.update(
      {
        is_edit_locked: true
      },
      {
        where: {
          id: image.publication_id
        },
        transaction
      }
    );

    const reportsCount = await ImageReport.count({
      where: {
        image_id: image.id,
        status: 'pending'
      },
      transaction
    });

    if (reportsCount >= REPORT_THRESHOLD) {
      await Publication.update(
        {
          status: 'under_review',
          is_edit_locked: true
        },
        {
          where: {
            id: image.publication_id
          },
          transaction
        }
      );
    }

    await createNotification({
  userId: image.publication.user_id,
  actorId: userId,
  type: 'report',
  entityType: 'publication',
  entityId: image.publication_id,
  message: `Una imagen de tu publicación "${image.publication.title}" recibió una denuncia.`,
  transaction
});

    return {
      publicationId: image.publication_id
    };
  });
};

module.exports = {
  createImageReport
};
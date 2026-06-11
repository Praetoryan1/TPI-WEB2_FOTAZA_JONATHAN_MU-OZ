const {
  sequelize,
  Publication,
  Image,
  ImageReport,
  User
} = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

const getModerationQueue = async () => {
  return Publication.findAll({
    where: {
      status: 'under_review'
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: [
          'id',
          'nickname',
          'email',
          'banned_publications_count',
          'is_active'
        ]
      },
      {
        model: Image,
        as: 'images',
        include: [
          {
            model: ImageReport,
            as: 'reports',
            where: {
              status: 'pending'
            },
            required: false,
            include: [
              {
                model: User,
                as: 'reporter',
                attributes: ['id', 'nickname', 'email']
              }
            ]
          }
        ]
      }
    ],
    order: [['updated_at', 'DESC']]
  });
};

const dismissPublicationReports = async ({ publicationId, reviewerId }) => {
  return sequelize.transaction(async (transaction) => {
    const publication = await Publication.findByPk(publicationId, {
      include: [
        {
          model: Image,
          as: 'images'
        }
      ],
      transaction
    });

    if (!publication) {
      throw new Error('La publicación no existe.');
    }

    const imageIds = publication.images.map((image) => image.id);

    await ImageReport.update(
      {
        status: 'dismissed',
        reviewed_by: reviewerId,
        reviewed_at: new Date()
      },
      {
        where: {
          image_id: imageIds,
          status: 'pending'
        },
        transaction
      }
    );

    await publication.update(
      {
        status: 'active',
        is_edit_locked: false
      },
      { transaction }
    );

    await createNotification({
      userId: publication.user_id,
      actorId: reviewerId,
      type: 'report',
      entityType: 'publication',
      entityId: publication.id,
      message: `Las denuncias sobre tu publicación "${publication.title}" fueron desestimadas.`
    });

    return publication;
  });
};

const disablePublication = async ({ publicationId, reviewerId }) => {
  return sequelize.transaction(async (transaction) => {
    const publication = await Publication.findByPk(publicationId, {
      include: [
        {
          model: User,
          as: 'author'
        },
        {
          model: Image,
          as: 'images'
        }
      ],
      transaction
    });

    if (!publication) {
      throw new Error('La publicación no existe.');
    }

    const imageIds = publication.images.map((image) => image.id);

    await ImageReport.update(
      {
        status: 'accepted',
        reviewed_by: reviewerId,
        reviewed_at: new Date()
      },
      {
        where: {
          image_id: imageIds,
          status: 'pending'
        },
        transaction
      }
    );

    await publication.update(
      {
        status: 'disabled',
        is_edit_locked: true
      },
      { transaction }
    );

    const author = publication.author;

    if (author) {
      const newCount = Number(author.banned_publications_count) + 1;

      await author.update(
        {
          banned_publications_count: newCount,
          is_active: newCount >= 3 ? false : author.is_active
        },
        { transaction }
      );

      await createNotification({
        userId: author.id,
        actorId: reviewerId,
        type: 'report',
        entityType: 'publication',
        entityId: publication.id,
        message: `Tu publicación "${publication.title}" fue dada de baja por moderación.`
      });
    }

    return publication;
  });
};

module.exports = {
  getModerationQueue,
  dismissPublicationReports,
  disablePublication
};
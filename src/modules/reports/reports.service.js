const {
  sequelize,
  ImageReport,
  CommentReport,
  Image,
  Publication,
  User,
  Comment
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

const getCommentWithContext = async (commentId) => {
  return Comment.findByPk(commentId, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'nickname']
      },
      {
        model: Image,
        as: 'image',
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

const createCommentReport = async ({
  commentId,
  userId,
  reasonType,
  description
}) => {
  return sequelize.transaction(async (transaction) => {
    const comment = await getCommentWithContext(commentId);

    if (!comment || comment.is_deleted) {
      throw new Error('El comentario no existe o fue eliminado.');
    }

    if (!comment.image || !comment.image.publication) {
      throw new Error('No se encontró la publicación asociada.');
    }

    const publication = comment.image.publication;

    if (publication.status === 'disabled') {
      throw new Error('La publicación no se encuentra disponible.');
    }

    if (Number(comment.user_id) === Number(userId)) {
      throw new Error('No podés denunciar tu propio comentario.');
    }

    const existingReport = await CommentReport.findOne({
      where: {
        comment_id: comment.id,
        user_id: userId
      },
      transaction
    });

    if (existingReport) {
      throw new Error('Ya denunciaste este comentario.');
    }

    await CommentReport.create(
      {
        comment_id: comment.id,
        user_id: userId,
        reason_type: reasonType,
        description: description.trim(),
        status: 'pending'
      },
      { transaction }
    );

    await createNotification({
      userId: publication.user_id,
      actorId: userId,
      type: 'report',
      entityType: 'comment',
      entityId: comment.id,
      message: `Un comentario en tu publicación "${publication.title}" recibió una denuncia.`,
      transaction
    });

    return {
      publicationId: publication.id
    };
  });
};

const cancelCommentReport = async ({ commentId, userId }) => {
  const report = await CommentReport.findOne({
    where: {
      comment_id: commentId,
      user_id: userId,
      status: 'pending'
    }
  });

  if (!report) {
    throw new Error('No existe una denuncia pendiente para cancelar.');
  }

  await report.destroy();

  return true;
};

module.exports = {
  createImageReport,
  createCommentReport,
  cancelCommentReport
};
const {
  Comment,
  Image,
  Publication,
  User,
  CommentReport
} = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

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
            attributes: ['id', 'nickname', 'email']
          }
        ]
      }
    ]
  });
};

const createComment = async ({ imageId, userId, content }) => {
  const image = await getImageWithPublication(imageId);

  if (!image) {
    throw new Error('La imagen no existe.');
  }

  if (!image.comments_enabled) {
    throw new Error('Los comentarios están cerrados para esta imagen.');
  }

  if (!image.publication || image.publication.status === 'disabled') {
    throw new Error('La publicación no se encuentra disponible.');
  }

  const comment = await Comment.create({
    image_id: image.id,
    user_id: userId,
    content: content.trim(),
    is_deleted: false
  });

  if (image.publication && Number(image.publication.user_id) !== Number(userId)) {
  await createNotification({
    userId: image.publication.user_id,
    actorId: userId,
    type: 'comment',
    entityType: 'publication',
    entityId: image.publication_id,
    message: `Comentaron una imagen de tu publicación "${image.publication.title}".`
  });
}

  return {
    comment,
    publicationId: image.publication_id
  };
};

const toggleComments = async ({ imageId, userId }) => {
  const image = await getImageWithPublication(imageId);

  if (!image) {
    throw new Error('La imagen no existe.');
  }

  if (!image.publication) {
    throw new Error('La publicación no existe.');
  }

  if (image.publication.user_id !== userId) {
    throw new Error('Solo el autor puede modificar el estado de los comentarios.');
  }

  image.comments_enabled = !image.comments_enabled;
  await image.save();

  return {
    image,
    publicationId: image.publication_id
  };
};

const isPrivilegedReviewer = (roleName) => {
  return roleName === 'admin' || roleName === 'validator';
};

const getReportsForReviewer = async ({ reviewerId, reviewerRole }) => {
  const isPrivileged = isPrivilegedReviewer(reviewerRole);

  const publicationWhere = isPrivileged
    ? {}
    : {
        user_id: reviewerId
      };

  return CommentReport.findAll({
    where: {
      status: 'pending'
    },
    include: [
      {
        model: Comment,
        as: 'comment',
        required: true,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'nickname', 'email'],
            required: false
          },
          {
            model: Image,
            as: 'image',
            required: true,
            include: [
              {
                model: Publication,
                as: 'publication',
                required: true,
                where: publicationWhere,
                include: [
                  {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'nickname', 'email'],
                    required: false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        model: User,
        as: 'reporter',
        attributes: ['id', 'nickname', 'email'],
        required: false
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const canReviewCommentReport = async ({ commentId, reviewerId, reviewerRole }) => {
  const comment = await Comment.findByPk(commentId, {
    include: [
      {
        model: Image,
        as: 'image',
        include: [
          {
            model: Publication,
            as: 'publication'
          }
        ]
      }
    ]
  });

  if (!comment || !comment.image || !comment.image.publication) {
    throw new Error('El comentario no existe.');
  }

  const isPublicationAuthor =
    Number(comment.image.publication.user_id) === Number(reviewerId);

  const isPrivileged = isPrivilegedReviewer(reviewerRole);

  if (!isPublicationAuthor && !isPrivileged) {
    throw new Error('No tenés permiso para revisar esta denuncia.');
  }

  return comment;
};

const deleteReportedComment = async ({ commentId, reviewerId, reviewerRole }) => {
  const comment = await canReviewCommentReport({
    commentId,
    reviewerId,
    reviewerRole
  });

  comment.is_deleted = true;
  await comment.save();

  await CommentReport.update(
    {
      status: 'accepted',
      reviewed_by: reviewerId,
      reviewed_at: new Date()
    },
    {
      where: {
        comment_id: commentId,
        status: 'pending'
      }
    }
  );

  return comment;
};

const dismissCommentReports = async ({ commentId, reviewerId, reviewerRole }) => {
  const comment = await canReviewCommentReport({
    commentId,
    reviewerId,
    reviewerRole
  });

  await CommentReport.update(
    {
      status: 'dismissed',
      reviewed_by: reviewerId,
      reviewed_at: new Date()
    },
    {
      where: {
        comment_id: commentId,
        status: 'pending'
      }
    }
  );

  return comment;
};

module.exports = {
  createComment,
  toggleComments,
  getReportsForReviewer,
  deleteReportedComment,
  dismissCommentReports
};
const {
  Comment,
  Image,
  Publication,
  User
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

const { CommentReport } = require('../../database/models');

const getReportsForAuthor = async (authorId) => {
  return CommentReport.findAll({
    where: {
      status: 'pending'
    },
    include: [
      {
        model: Comment,
        as: 'comment',
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'nickname', 'email']
          },
          {
            model: Image,
            as: 'image',
            include: [
              {
                model: Publication,
                as: 'publication',
                where: {
                  user_id: authorId
                }
              }
            ]
          }
        ]
      },
      {
        model: User,
        as: 'reporter',
        attributes: ['id', 'nickname', 'email']
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const deleteReportedComment = async ({ commentId, authorId }) => {
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

  if (Number(comment.image.publication.user_id) !== Number(authorId)) {
    throw new Error('No tenés permiso para eliminar este comentario.');
  }

  comment.is_deleted = true;
  await comment.save();

  await CommentReport.update(
    {
      status: 'accepted',
      reviewed_by: authorId,
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

const dismissCommentReports = async ({ commentId, authorId }) => {
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

  if (Number(comment.image.publication.user_id) !== Number(authorId)) {
    throw new Error('No tenés permiso para revisar este comentario.');
  }

  await CommentReport.update(
    {
      status: 'dismissed',
      reviewed_by: authorId,
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
  getReportsForAuthor,
  deleteReportedComment,
  dismissCommentReports
};
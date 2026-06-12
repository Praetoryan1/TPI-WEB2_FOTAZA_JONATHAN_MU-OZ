const {
  sequelize,
  Image,
  Publication,
  User,
  InterestRequest,
  Conversation,
  Message
} = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

const createInterestRequest = async ({ imageId, buyerId, message }) => {
  return sequelize.transaction(async (transaction) => {
    const image = await Image.findByPk(imageId, {
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
      ],
      transaction
    });

    if (!image || !image.publication) {
      throw new Error('La imagen no existe.');
    }

    if (image.publication.status !== 'active') {
      throw new Error('La publicación no está disponible.');
    }

    const authorId = image.publication.user_id;

    if (Number(authorId) === Number(buyerId)) {
      throw new Error('No podés marcar interés en una imagen propia.');
    }

    let interestRequest = await InterestRequest.findOne({
      where: {
        image_id: image.id,
        buyer_id: buyerId
      },
      transaction
    });

    if (!interestRequest) {
      interestRequest = await InterestRequest.create(
        {
          image_id: image.id,
          buyer_id: buyerId,
          author_id: authorId,
          status: 'pending',
          message: message ? message.trim() : null
        },
        { transaction }
      );
    }

    let conversation = await Conversation.findOne({
      where: {
        interest_request_id: interestRequest.id
      },
      transaction
    });

    if (!conversation) {
      conversation = await Conversation.create(
        {
          interest_request_id: interestRequest.id,
          image_id: image.id,
          buyer_id: buyerId,
          seller_id: authorId
        },
        { transaction }
      );

      if (message && message.trim()) {
        await Message.create(
          {
            conversation_id: conversation.id,
            sender_id: buyerId,
            content: message.trim(),
            is_read: false
          },
          { transaction }
        );
      }

      await createNotification({
        userId: authorId,
        actorId: buyerId,
        type: 'interest',
        entityType: 'conversation',
        entityId: conversation.id,
        message: `Mostraron interés en una imagen de tu publicación "${image.publication.title}".`,
        transaction
      });
    }

    return {
      conversationId: conversation.id
    };
  });
};

module.exports = {
  createInterestRequest
};
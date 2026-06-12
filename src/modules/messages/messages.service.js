const { Op } = require('sequelize');
const {
  Conversation,
  Message,
  User,
  Image,
  Publication
} = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

const getUserConversations = async (userId) => {
  return Conversation.findAll({
    where: {
      [Op.or]: [
        { buyer_id: userId },
        { seller_id: userId }
      ]
    },
    include: [
      {
        model: User,
        as: 'buyer',
        attributes: ['id', 'nickname', 'email']
      },
      {
        model: User,
        as: 'seller',
        attributes: ['id', 'nickname', 'email']
      },
      {
        model: Image,
        as: 'image',
        include: [
          {
            model: Publication,
            as: 'publication',
            attributes: ['id', 'title']
          }
        ]
      },
      {
        model: Message,
        as: 'messages',
        required: false,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'nickname']
          }
        ]
      }
    ],
    order: [['updated_at', 'DESC']]
  });
};

const getConversationById = async ({ conversationId, userId }) => {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
      [Op.or]: [
        { buyer_id: userId },
        { seller_id: userId }
      ]
    },
    include: [
      {
        model: User,
        as: 'buyer',
        attributes: ['id', 'nickname', 'email']
      },
      {
        model: User,
        as: 'seller',
        attributes: ['id', 'nickname', 'email']
      },
      {
        model: Image,
        as: 'image',
        include: [
          {
            model: Publication,
            as: 'publication',
            attributes: ['id', 'title']
          }
        ]
      },
      {
        model: Message,
        as: 'messages',
        required: false,
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'nickname']
          }
        ]
      }
    ],
    order: [[{ model: Message, as: 'messages' }, 'created_at', 'ASC']]
  });

  if (!conversation) {
    return null;
  }

  await Message.update(
    {
      is_read: true
    },
    {
      where: {
        conversation_id: conversation.id,
        sender_id: {
          [Op.ne]: userId
        },
        is_read: false
      }
    }
  );

  return conversation;
};

const sendMessage = async ({ conversationId, senderId, content }) => {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
      [Op.or]: [
        { buyer_id: senderId },
        { seller_id: senderId }
      ]
    }
  });

  if (!conversation) {
    throw new Error('La conversación no existe.');
  }

  const message = await Message.create({
    conversation_id: conversation.id,
    sender_id: senderId,
    content: content.trim(),
    is_read: false
  });

  await conversation.update({
    updated_at: new Date()
  });

  const recipientId =
    Number(conversation.buyer_id) === Number(senderId)
      ? conversation.seller_id
      : conversation.buyer_id;

  await createNotification({
    userId: recipientId,
    actorId: senderId,
    type: 'message',
    entityType: 'conversation',
    entityId: conversation.id,
    message: 'Recibiste un nuevo mensaje privado.'
  });

  return message;
};

module.exports = {
  getUserConversations,
  getConversationById,
  sendMessage
};
const { Notification, User } = require('../../database/models');

const createNotification = async ({
  userId,
  actorId = null,
  type,
  entityType = null,
  entityId = null,
  message
}) => {
  if (!userId || !type || !message) {
    return null;
  }

  if (actorId && Number(userId) === Number(actorId)) {
    return null;
  }

  return Notification.create({
    user_id: userId,
    actor_id: actorId,
    type,
    entity_type: entityType,
    entity_id: entityId,
    message,
    is_read: false
  });
};

const getUserNotifications = async (userId) => {
  return Notification.findAll({
    where: {
      user_id: userId
    },
    include: [
      {
        model: User,
        as: 'actor',
        attributes: ['id', 'nickname', 'profile_image_url'],
        required: false
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const markAsRead = async ({ notificationId, userId }) => {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      user_id: userId
    }
  });

  if (!notification) {
    throw new Error('La notificación no existe.');
  }

  notification.is_read = true;
  await notification.save();

  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.update(
    {
      is_read: true
    },
    {
      where: {
        user_id: userId,
        is_read: false
      }
    }
  );
};

const countUnreadNotifications = async (userId) => {
  return Notification.count({
    where: {
      user_id: userId,
      is_read: false
    }
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  countUnreadNotifications
};
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} = require('./notifications.service');

const index = async (req, res) => {
  const notifications = await getUserNotifications(req.user.id);

  return res.render('notifications/index', {
    title: 'Notificaciones',
    notifications
  });
};

const read = async (req, res) => {
  try {
    await markAsRead({
      notificationId: req.params.id,
      userId: req.user.id
    });

    return res.redirect('/notifications');
  } catch (error) {
    return res.redirect('/notifications');
  }
};

const readAll = async (req, res) => {
  await markAllAsRead(req.user.id);

  return res.redirect('/notifications');
};

module.exports = {
  index,
  read,
  readAll
};
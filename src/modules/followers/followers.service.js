const { Follower, User } = require('../../database/models');

const { createNotification } = require('../notifications/notifications.service');

const toggleFollow = async ({ followerId, followedId }) => {
  if (Number(followerId) === Number(followedId)) {
    throw new Error('No podés seguirte a vos mismo.');
  }

  const followedUser = await User.findByPk(followedId);

  if (!followedUser || !followedUser.is_active) {
    throw new Error('El usuario que intentás seguir no existe o está inactivo.');
  }

  const existingFollow = await Follower.findOne({
    where: {
      follower_id: followerId,
      followed_id: followedId
    }
  });

  if (existingFollow) {
    await existingFollow.destroy();

    return {
      following: false,
      followedId
    };
  }

  await Follower.create({
    follower_id: followerId,
    followed_id: followedId
  });

  await createNotification({
  userId: followedId,
  actorId: followerId,
  type: 'follow',
  entityType: 'user',
  entityId: followerId,
  message: 'Comenzaron a seguirte.'
});

  return {
    following: true,
    followedId
  };
};

module.exports = {
  toggleFollow
};
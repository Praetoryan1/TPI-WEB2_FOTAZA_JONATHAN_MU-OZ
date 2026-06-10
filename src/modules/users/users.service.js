const { Op } = require('sequelize');
const {
  User,
  Publication,
  Image,
  Tag,
  Follower
} = require('../../database/models');

const getUserProfile = async ({ profileUserId, currentUserId = null }) => {
  const user = await User.findByPk(profileUserId, {
    attributes: [
      'id',
      'nickname',
      'email',
      'biography',
      'profile_image_url',
      'is_active',
      'created_at'
    ],
    include: [
      {
        model: Publication,
        as: 'publications',
        where: {
          status: 'active'
        },
        required: false,
        include: [
          {
            model: Image,
            as: 'images',
            required: false
          },
          {
            model: Tag,
            as: 'tags',
            through: {
              attributes: []
            }
          }
        ]
      }
    ],
    order: [[{ model: Publication, as: 'publications' }, 'created_at', 'DESC']]
  });

  if (!user || !user.is_active) {
    return null;
  }

  const followersCount = await Follower.count({
    where: {
      followed_id: profileUserId
    }
  });

  const followingCount = await Follower.count({
    where: {
      follower_id: profileUserId
    }
  });

  let isFollowing = false;

  if (currentUserId && Number(currentUserId) !== Number(profileUserId)) {
    const existingFollow = await Follower.findOne({
      where: {
        follower_id: currentUserId,
        followed_id: profileUserId
      }
    });

    isFollowing = Boolean(existingFollow);
  }

  return {
    user,
    followersCount,
    followingCount,
    isFollowing,
    isOwnProfile:
      currentUserId && Number(currentUserId) === Number(profileUserId)
  };
};

const getFollowingUsers = async (userId) => {
  const follows = await Follower.findAll({
    where: {
      follower_id: userId
    },
    include: [
      {
        model: User,
        as: 'followedUser',
        required: false
      }
    ]
  });

  return follows;
};

const getFollowingFeed = async (userId) => {
  const followingRelations = await Follower.findAll({
    where: {
      follower_id: userId
    },
    attributes: ['followed_id']
  });

  const followedIds = followingRelations.map((relation) => relation.followed_id);

  if (followedIds.length === 0) {
    return [];
  }

  return Publication.findAll({
    where: {
      user_id: {
        [Op.in]: followedIds
      },
      status: 'active'
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'nickname', 'profile_image_url']
      },
      {
        model: Image,
        as: 'images',
        required: false
      },
      {
        model: Tag,
        as: 'tags',
        through: {
          attributes: []
        }
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

module.exports = {
  getUserProfile,
  getFollowingFeed
};
const { toggleFollow } = require('./followers.service');

const toggle = async (req, res) => {
  try {
    await toggleFollow({
      followerId: req.user.id,
      followedId: req.params.userId
    });

    return res.redirect(`/users/${req.params.userId}`);
  } catch (error) {
    return res.redirect(`/users/${req.params.userId}`);
  }
};

module.exports = {
  toggle
};
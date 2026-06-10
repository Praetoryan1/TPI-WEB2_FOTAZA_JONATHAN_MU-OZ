const { getUserProfile, getFollowingFeed } = require('./users.service');

const showMe = (req, res) => {
  return res.redirect(`/users/${req.user.id}`);
};

const showProfile = async (req, res) => {
  const profileData = await getUserProfile({
    profileUserId: req.params.id,
    currentUserId: req.user ? req.user.id : null
  });

  if (!profileData) {
    return res.status(404).render('errors/404', {
      title: 'Usuario no encontrado'
    });
  }

  return res.render('users/profile', {
    title: `Perfil de ${profileData.user.nickname}`,
    profileData
  });
};

const followingFeed = async (req, res) => {
  const publications = await getFollowingFeed(req.user.id);

  return res.render('users/following-feed', {
    title: 'Publicaciones de usuarios que sigo',
    publications
  });
};

module.exports = {
  showMe,
  showProfile,
  followingFeed
};
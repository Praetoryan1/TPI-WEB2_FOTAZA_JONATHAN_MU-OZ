const {
  getModerationQueue,
  dismissPublicationReports,
  disablePublication
} = require('./moderation.service');

const dashboard = async (req, res) => {
  const publications = await getModerationQueue();

  return res.render('moderation/dashboard', {
    title: 'Moderación de contenidos',
    publications
  });
};

const dismiss = async (req, res) => {
  try {
    await dismissPublicationReports({
      publicationId: req.params.publicationId,
      reviewerId: req.user.id
    });

    return res.redirect('/moderation');
  } catch (error) {
    return res.redirect('/moderation');
  }
};

const disable = async (req, res) => {
  try {
    await disablePublication({
      publicationId: req.params.publicationId,
      reviewerId: req.user.id
    });

    return res.redirect('/moderation');
  } catch (error) {
    console.error('Error al dar de baja publicación:', error);
    console.error('Mensaje MySQL:', error.parent?.sqlMessage);
    console.error('SQL:', error.sql);

    return res.redirect('/moderation');
  }
};

module.exports = {
  dashboard,
  dismiss,
  disable
};
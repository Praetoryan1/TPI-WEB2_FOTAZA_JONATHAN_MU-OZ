const { validateComment } = require('./comments.validator');
const { createComment, toggleComments } = require('./comments.service');

const store = async (req, res) => {
  try {
    const errors = validateComment(req.body);

    if (errors.length > 0) {
      return res.redirect(`/publications/${req.body.publication_id || ''}`);
    }

    const result = await createComment({
      imageId: req.params.imageId,
      userId: req.user.id,
      content: req.body.content
    });

    return res.redirect(`/publications/${result.publicationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.body.publication_id || ''}`);
  }
};

const toggle = async (req, res) => {
  try {
    const result = await toggleComments({
      imageId: req.params.imageId,
      userId: req.user.id
    });

    return res.redirect(`/publications/${result.publicationId}`);
  } catch (error) {
    return res.status(403).render('errors/403', {
      title: 'Acceso denegado'
    });
  }
};

module.exports = {
  store,
  toggle
};
const { validateRating } = require('./ratings.validator');
const { rateImage } = require('./ratings.service');

const store = async (req, res) => {
  try {
    const errors = validateRating(req.body);

    if (errors.length > 0) {
      return res.redirect(`/publications/${req.body.publication_id || ''}`);
    }

    const result = await rateImage({
      imageId: req.params.imageId,
      userId: req.user.id,
      value: req.body.value
    });

    return res.redirect(`/publications/${result.publicationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.body.publication_id || ''}`);
  }
};

module.exports = {
  store
};
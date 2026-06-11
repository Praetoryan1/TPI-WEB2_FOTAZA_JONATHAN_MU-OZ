const {
  validateImageReport,
  validateCommentReport
} = require('./reports.validator');

const {
  createImageReport,
  createCommentReport
} = require('./reports.service');

const storeImageReport = async (req, res) => {
  try {
    const errors = validateImageReport(req.body);

    if (errors.length > 0) {
      return res.redirect(`/publications/${req.body.publication_id || ''}`);
    }

    const result = await createImageReport({
      imageId: req.params.imageId,
      userId: req.user.id,
      reasonType: req.body.reason_type,
      description: req.body.description
    });

    return res.redirect(`/publications/${result.publicationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.body.publication_id || ''}`);
  }
};

const storeCommentReport = async (req, res) => {
  try {
    const errors = validateCommentReport(req.body);

    if (errors.length > 0) {
      return res.redirect(`/publications/${req.body.publication_id || ''}`);
    }

    const result = await createCommentReport({
      commentId: req.params.commentId,
      userId: req.user.id,
      reasonType: req.body.reason_type,
      description: req.body.description
    });

    return res.redirect(`/publications/${result.publicationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.body.publication_id || ''}`);
  }
};

module.exports = {
  storeImageReport,
  storeCommentReport
};
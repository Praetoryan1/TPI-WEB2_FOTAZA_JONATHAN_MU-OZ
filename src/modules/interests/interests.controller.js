const { validateInterestRequest } = require('./interests.validator');
const { createInterestRequest } = require('./interests.service');

const store = async (req, res) => {
  try {
    const errors = validateInterestRequest(req.body);

    if (errors.length > 0) {
      return res.redirect(`/publications/${req.body.publication_id || ''}`);
    }

    const result = await createInterestRequest({
      imageId: req.params.imageId,
      buyerId: req.user.id,
      message: req.body.message
    });

    return res.redirect(`/messages/${result.conversationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.body.publication_id || ''}`);
  }
};

module.exports = {
  store
};
const {
  createComment,
  toggleComments,
  getReportsForAuthor,
  deleteReportedComment,
  dismissCommentReports
} = require('./comments.service');

const { validateComment } = require('./comments.validator');

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

const reports = async (req, res) => {
  const commentReports = await getReportsForAuthor(req.user.id);

  return res.render('comments/reports', {
    title: 'Denuncias de comentarios',
    commentReports
  });
};

const deleteReported = async (req, res) => {
  try {
    await deleteReportedComment({
      commentId: req.params.commentId,
      authorId: req.user.id
    });

    return res.redirect('/comments/reports');
  } catch (error) {
    return res.redirect('/comments/reports');
  }
};

const dismissReports = async (req, res) => {
  try {
    await dismissCommentReports({
      commentId: req.params.commentId,
      authorId: req.user.id
    });

    return res.redirect('/comments/reports');
  } catch (error) {
    return res.redirect('/comments/reports');
  }
};

module.exports = {
  store,
  toggle,
  reports,
  deleteReported,
  dismissReports
};
const express = require('express');
const commentsController = require('./comments.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/reports', requireAuth, commentsController.reports);

router.post('/images/:imageId', requireAuth, commentsController.store);
router.post('/images/:imageId/toggle', requireAuth, commentsController.toggle);

router.post('/:commentId/delete-reported', requireAuth, commentsController.deleteReported);
router.post('/:commentId/dismiss-reports', requireAuth, commentsController.dismissReports);

module.exports = router;
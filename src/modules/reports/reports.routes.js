const express = require('express');
const reportsController = require('./reports.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/images/:imageId', requireAuth, reportsController.storeImageReport);
router.post('/comments/:commentId', requireAuth, reportsController.storeCommentReport);

router.post(
  '/comments/:commentId/cancel',
  requireAuth,
  reportsController.cancelOwnCommentReport
);

module.exports = router;
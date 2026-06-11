const express = require('express');
const moderationController = require('./moderation.controller');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/',
  requireAuth,
  requireRole('admin', 'validator'),
  moderationController.dashboard
);

router.post(
  '/publications/:publicationId/dismiss',
  requireAuth,
  requireRole('admin', 'validator'),
  moderationController.dismiss
);

router.post(
  '/publications/:publicationId/disable',
  requireAuth,
  requireRole('admin', 'validator'),
  moderationController.disable
);

module.exports = router;
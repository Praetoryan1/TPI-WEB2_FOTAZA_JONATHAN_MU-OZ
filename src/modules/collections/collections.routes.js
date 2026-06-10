const express = require('express');
const collectionsController = require('./collections.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, collectionsController.index);
router.post('/', requireAuth, collectionsController.store);

router.post(
  '/publications/:publicationId/add',
  requireAuth,
  collectionsController.addPublication
);

router.get('/:id', requireAuth, collectionsController.detail);

router.post(
  '/:collectionId/publications/:publicationId/remove',
  requireAuth,
  collectionsController.removePublication
);

module.exports = router;
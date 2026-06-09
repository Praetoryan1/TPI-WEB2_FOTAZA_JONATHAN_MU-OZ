const express = require('express');
const publicationsController = require('./publications.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const { uploadPublicationImages } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.get('/', publicationsController.index);
router.get('/create', requireAuth, publicationsController.showCreate);

router.post(
  '/',
  requireAuth,
  uploadPublicationImages.array('images', 5),
  publicationsController.store
);

router.get('/:id', publicationsController.detail);

module.exports = router;
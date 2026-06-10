const express = require('express');
const commentsController = require('./comments.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/images/:imageId', requireAuth, commentsController.store);
router.post('/images/:imageId/toggle', requireAuth, commentsController.toggle);

module.exports = router;
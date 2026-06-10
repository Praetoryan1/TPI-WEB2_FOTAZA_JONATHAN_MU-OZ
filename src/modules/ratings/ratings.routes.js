const express = require('express');
const ratingsController = require('./ratings.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/images/:imageId', requireAuth, ratingsController.store);

module.exports = router;
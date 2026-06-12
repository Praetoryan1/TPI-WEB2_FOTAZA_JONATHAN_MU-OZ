const express = require('express');
const interestsController = require('./interests.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/images/:imageId', requireAuth, interestsController.store);

module.exports = router;
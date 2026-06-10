const express = require('express');
const followersController = require('./followers.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/:userId/toggle', requireAuth, followersController.toggle);

module.exports = router;
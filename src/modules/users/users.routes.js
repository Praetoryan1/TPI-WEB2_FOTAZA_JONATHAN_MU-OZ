const express = require('express');
const usersController = require('./users.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', requireAuth, usersController.showMe);
router.get('/following-feed', requireAuth, usersController.followingFeed);
router.get('/:id', usersController.showProfile);

module.exports = router;
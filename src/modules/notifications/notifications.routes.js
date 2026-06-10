const express = require('express');
const notificationsController = require('./notifications.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, notificationsController.index);
router.post('/read-all', requireAuth, notificationsController.readAll);
router.post('/:id/read', requireAuth, notificationsController.read);

module.exports = router;
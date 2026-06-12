const express = require('express');
const messagesController = require('./messages.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', requireAuth, messagesController.index);
router.get('/:id', requireAuth, messagesController.show);
router.post('/:id', requireAuth, messagesController.store);

module.exports = router;
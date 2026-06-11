const express = require('express');
const reportsController = require('./reports.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/images/:imageId', requireAuth, reportsController.storeImageReport);

module.exports = router;
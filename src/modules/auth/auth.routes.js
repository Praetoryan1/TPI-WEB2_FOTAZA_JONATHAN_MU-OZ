const express = require('express');
const authController = require('./auth.controller');
const { requireGuest, requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);

router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);

router.post('/logout', requireAuth, authController.logout);

module.exports = router;
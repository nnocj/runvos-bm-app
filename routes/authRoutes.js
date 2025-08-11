const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const validateAuth = require('../utilities/validateAuth');

const router = express.Router();

// Manual register & login
router.post('/register', validateAuth.registerValidationRules(), validateAuth.validateResults, authController.register);
router.post('/login', validateAuth.loginValidationRules(), validateAuth.validateResults, authController.login);

// Refresh & logout
router.post('/refresh', validateAuth.refreshTokenValidationRules(), validateAuth.validateResults, authController.refresh);
router.post('/logout', validateAuth.logoutValidationRules(), validateAuth.validateResults, authController.logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }), authController.googleCallback);
router.get('/failure', (req, res) => res.status(401).json({ error: 'Google login failed' }));

module.exports = router;

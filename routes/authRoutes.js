const express = require('express');
const passport = require('passport');
const authController = require('../controller/authController');
const validateAuth = require('../utilities/validateAuth');
const  errorHandler = require('../middleware/handleErrors');


const router = express.Router();

// Manual register & login
router.post('/register', validateAuth.registerValidationRules(), validateAuth.validateResults, errorHandler.generalHandleErrors(authController.register));
router.post('/login', validateAuth.loginValidationRules(), validateAuth.validateResults, errorHandler.generalHandleErrors(authController.login));

// Refresh & logout
router.post('/refresh', validateAuth.refreshTokenValidationRules(), validateAuth.validateResults, errorHandler.generalHandleErrors(authController.refresh));
router.post('/logout', validateAuth.logoutValidationRules(), validateAuth.validateResults, errorHandler.generalHandleErrors(authController.logout));

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }), errorHandler.generalHandleErrors(authController.googleCallback));
router.get('/failure', (req, res) => res.status(401).json({ error: 'Google login failed' }));

module.exports = router;

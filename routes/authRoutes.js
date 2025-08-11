const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // your MongoDB User model
const { generateTokens } = require('../middleware/token');

const router = express.Router();

// Manual login with email/password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!user.password) {
      return res.status(400).json({ error: 'Use Google login for this account' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// ===== Refresh Access Token =====
router.post('/refresh', async(req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(403).json({ error: 'Refresh token not valid' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired refresh token' });

    const payload = { id: user.id, name: user.name, email: user.email };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  });
});


// ===== JWT logout =====
router.post('/logout', async(req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.json({ message: 'Logout successful. Delete tokens on client.' });
});

// Google OAuth start
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.user.email });

      if (!user) {
        user = await User.create({
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          googleId: req.user.id,
          address: {},
          phone: '',
          birthdate: null,
          gender: ''
        });
      }

      const tokens = generateTokens(user);
      res.json(tokens);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/failure', (req, res) => {
  res.status(401).json({ error: 'Google login failed' });
});

module.exports = router;

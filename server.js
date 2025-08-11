const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtVerify = require('./middleware/jwt.js');

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
const userRoutes = require('./routes/userInfoRoutes');
const businessRoutes = require('./routes/businessInfoRoutes');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(express.json());

// ===== Temporary in-memory refresh token store =====
// In production, use a database or Redis instead
const refreshTokens = new Set();

// ===== Helper: Generate Access & Refresh Tokens =====
function generateTokens(user) {
  const payload = { id: user.id, name: user.name, email: user.email };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  refreshTokens.add(refreshToken);
  return { accessToken, refreshToken };
}

// ===== Passport Google OAuth Strategy =====
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails && profile.emails[0]?.value,
      photo: profile.photos && profile.photos[0]?.value
    };
    return done(null, user);
  }
));

app.use(passport.initialize());

// ===== Serve static files =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API Routes =====
app.use('/api/user', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===== Google OAuth login =====
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ===== Google OAuth callback =====
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const tokens = generateTokens(req.user);
    res.json(tokens); // { accessToken, refreshToken }
  }
);

app.get('/auth/failure', (req, res) => {
  res.status(401).send('Failed to authenticate.');
});

// ===== Refresh Access Token =====
app.post('/auth/refresh', (req, res) => {
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

// ===== JWT-protected example route =====
app.get('/api/secure', jwtVerify.verifyJWT(), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is protected data.` });
});

// ===== JWT logout =====
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.json({ message: 'Logout successful. Delete tokens on client.' });
});

// ===== Start server =====
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running. Swagger docs at /api-docs');
});

const { connectToDB } = require('../data/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateTokens, refreshTokens } = require('../middleware/token');

// ===== Manual Registration =====
async function register(req, res) {
  const { firstName, lastName, email, password, address, phone, birthdate, gender } = req.body;

  const db = await connectToDB();
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered. Try logging in instead.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    googleId: null,
    address: address || {},
    phone: phone || '',
    birthdate: birthdate || null,
    gender: gender || ''
  };

  const result = await db.collection('users').insertOne(newUser);
  const insertedUser = { ...newUser, _id: result.insertedId };

  const tokens = generateTokens(insertedUser);
  res.status(201).json(tokens);
}

// ===== Manual Login =====
async function login(req, res) {
  const { email, password } = req.body;
  const db = await connectToDB();

  const existingUser = await db.collection('users').findOne({ email });
  if (!existingUser) return res.status(400).json({ error: 'User not found' });

  if (!existingUser.password) {
    return res.status(400).json({ error: 'Use Google login for this account' });
  }

  const match = await bcrypt.compare(password, existingUser.password);
  if (!match) return res.status(400).json({ error: 'Invalid password' });

  const tokens = generateTokens(existingUser);
  res.json(tokens);
}

// ===== Refresh Access Token =====
async function refresh(req, res) {
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
}

// ===== Logout =====
async function logout(req, res) {
  const { refreshToken } = req.body || {};
  if (refreshToken) refreshTokens.delete(refreshToken);
  res.json({ message: 'Logout successful. Delete tokens on client.' });
}

// ===== Google OAuth Callback =====
async function googleCallback(req, res) {
  try {
    const db = await connectToDB();

    let existingUser = await db.collection('users').findOne({ email: req.user.email });

    if (!existingUser) {
      const newUser = {
        firstName: req.user.firstName || (req.user.name?.givenName ?? ''),
        lastName: req.user.lastName || (req.user.name?.familyName ?? ''),
        email: req.user.email,
        googleId: req.user.id,
        password: null,
        address: {},
        phone: '',
        birthdate: null,
        gender: ''
      };

      const result = await db.collection('users').insertOne(newUser);
      existingUser = { ...newUser, _id: result.insertedId };
    }

    const tokens = generateTokens(existingUser);

    // Detect if request came from popup or redirect
    // Option 1: If popup — window.opener exists
    // Option 2: If redirect — check for ?redirect=true query or absence of opener
    const isRedirect = req.query.redirect === 'true';

    if (isRedirect) {
      // ✅ Redirect flow — send tokens to frontend route
      // In production, use a short-lived code instead of sending tokens in URL directly
      const query = new URLSearchParams(tokens).toString();
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?${query}`);
    } else {
      // ✅ Popup flow — postMessage to opener
      res.setHeader("Content-Type", "text/html");
      return res.send(`
        <script>
          (function() {
            const tokens = ${JSON.stringify(tokens)};
            if (window.opener && typeof window.opener.postMessage === "function") {
              window.opener.postMessage({ type: "oauthTokens", ...tokens }, "*");
            }
            window.close();
          })();
        </script>
      `);
    }
  } catch (err) {
    console.error("Google callback error:", err);
    res.status(500).json({ error: 'Server error' });
  }
}


// Silent Google auth check
async function silentGoogleAuth(req, res) {
  try {
    // If using cookies for JWT
    const token = req.cookies?.accessToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const db = await connectToDB();
        const user = await db.collection('users').findOne({ email: payload.email });
        if (user) {
          const tokens = generateTokens(user);
          return res.json(tokens);
        }
      } catch (e) {
        // Token invalid or expired
      }
    }

    // Or, if using session-based passport
    if (req.isAuthenticated && req.isAuthenticated()) {
      const tokens = generateTokens(req.user);
      return res.json(tokens);
    }

    // Not authenticated
    return res.status(401).json({ error: 'No active Google session' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during silent auth' });
  }
}

module.exports = { register, login, refresh, logout, googleCallback, silentGoogleAuth };

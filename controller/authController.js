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
        firstName: req.user.firstName || '',
        lastName: req.user.lastName || '',
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
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { register, login, refresh, logout, googleCallback };

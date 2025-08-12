const jwt = require('jsonwebtoken');

const refreshTokens = new Set();

function generateTokens(user) {
  const payload = { id: user._id, email: user.email, name: user.firstName + ' ' + user.lastName };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  refreshTokens.add(refreshToken);  // Add refresh token to the set for validation

  return { accessToken, refreshToken };
}

module.exports = { generateTokens, refreshTokens };

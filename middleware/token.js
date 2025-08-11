const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const payload = { id: user._id, email: user.email, name: user.firstName + ' ' + user.lastName };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };

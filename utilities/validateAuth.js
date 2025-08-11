const { body } = require('express-validator');

const registerValidationRules = () => [
  body('firstName')
    .notEmpty().withMessage('First name is required.')
    .isString().withMessage('First name must be a string.'),
  body('lastName')
    .notEmpty().withMessage('Last name is required.')
    .isString().withMessage('Last name must be a string.'),
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('phone')
    .optional().isString().withMessage('Phone must be a string.'),
  body('birthdate')
    .optional().isISO8601().withMessage('Birthdate must be a valid date.'),
  body('gender')
    .optional().isString().withMessage('Gender must be a string.'),
  body('address.street')
    .optional().isString().withMessage('Street must be a string.'),
  body('address.city')
    .optional().isString().withMessage('City must be a string.'),
  body('address.state')
    .optional().isString().withMessage('State must be a string.'),
  body('address.zip')
    .optional().isString().withMessage('Zip must be a string.')
];

const loginValidationRules = () => [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email address.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
];

const refreshTokenValidationRules = () => [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required.')
];

const logoutValidationRules = () => [
  body('refreshToken')
    .optional().isString().withMessage('Refresh token must be a string if provided.')
];

// Middleware to handle validation results
const { validationResult } = require('express-validator');
function validateResults(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = {
  registerValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  logoutValidationRules,
  validateResults
};

const { body, validationResult } = require('express-validator');

// Define validation rules for creating/updating a user
const userValidationRules = () => {
  return [
    body('firstName')
      .notEmpty()
      .withMessage('firstName is required')
      .isString()
      .withMessage('firstName must be a string'),

    body('lastName')
      .notEmpty()
      .withMessage('lastName is required')
      .isString()
      .withMessage('lastName must be a string'),

    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
  ];
};

// Handle validation result
const validateResults = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: errors.array()
    });
  }

  next();
};

module.exports = {
  userValidationRules,
  validateResults
};

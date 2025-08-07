const { body, validationResult } = require('express-validator');

// business validation rules
const businessValidationRules = () => {
  return [
    body('userId')
      .notEmpty()
      .withMessage('User ID is required'),
    body('businesses')
      .notEmpty()
      .withMessage('At least one business is required'),
  ];
};

// Middleware to handle validation results
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
  businessValidationRules,
  validateResults
};

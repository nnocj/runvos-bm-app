const { body, validationResult } = require('express-validator');

// business validation rules
const businessValidationRules = () => {
  return [
    body('businessName').notEmpty().withMessage('Business name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Business location is required'),
    body('contact').notEmpty().withMessage('Contact information is required')
  ];
};

// Middleware to handle validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  businessValidationRules,
  validateResults
};

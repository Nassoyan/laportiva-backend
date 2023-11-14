const { body, validationResult } = require('express-validator');

exports.validateProduct = [
    body('name')
        .notEmpty().withMessage('Name field is required')
        .escape(),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

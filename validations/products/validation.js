const { body, validationResult } = require('express-validator');

exports.validateProduct = [
    // body('name')
    // .notEmpty().matches(/^[a-zA-Z0-9.]*$/).withMessage('Name field is required')
    // .escape(),
    body('name')
    .notEmpty().withMessage('Name field is required')
    .escape(),
    body('price')
        .notEmpty().withMessage('Price field is required')
        .isNumeric().withMessage('Price must be a number')
        .escape(),
    body('artikul').notEmpty().withMessage('Artikul field is required').escape(),
    body('code')
        .isAlphanumeric().withMessage('Name must contain letters and/or numbers')
        .escape(),
    body('brand_id').notEmpty().withMessage('Brand ID field is required and must be a number').escape(),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const { body, query, validationResult } = require('express-validator');
const { STATUSES, PRIORITIES, TITLE_MAX_LENGTH } = require('../constants');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 422,
        message: 'Validation failed',
        details: errors.array().map(err => ({ field: err.path, message: err.msg }))
      }
    });
  }
  next();
};

const validateCreateTicket = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: TITLE_MAX_LENGTH }).withMessage(`Title must be at most ${TITLE_MAX_LENGTH} characters`),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('customer_email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  handleValidationErrors
];

const validateUpdateTicket = [
  body('status')
    .optional()
    .isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('priority')
    .optional()
    .isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  (req, res, next) => {
    if (!req.body.status && !req.body.priority) {
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: 'At least one field (status or priority) must be provided for update',
          details: []
        }
      });
    }
    next();
  },
  handleValidationErrors
];

const validateQueryParams = [
  query('search').optional().trim(),
  query('status').optional().custom(value => {
    if (value && !STATUSES.includes(value)) {
      throw new Error(`Status filter must be one of: ${STATUSES.join(', ')}`);
    }
    return true;
  }),
  query('priority').optional().custom(value => {
    if (value && !PRIORITIES.includes(value)) {
      throw new Error(`Priority filter must be one of: ${PRIORITIES.join(', ')}`);
    }
    return true;
  }),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('pageSize must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  validateCreateTicket,
  validateUpdateTicket,
  validateQueryParams
};

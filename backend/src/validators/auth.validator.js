const { body, param } = require('express-validator');

const registerValidator = [
  body('full_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('full_name must be at least 2 characters long')
];

const updateRoleValidator = [
  param('userId').isUUID().withMessage('userId must be a valid UUID'),
  body('role').isIn(['user', 'admin']).withMessage("role must be either 'user' or 'admin'")
];

module.exports = {
  registerValidator,
  updateRoleValidator
};

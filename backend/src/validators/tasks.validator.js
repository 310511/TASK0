const { body, param, query } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('title must be at least 3 characters long'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("priority must be one of 'low', 'medium', 'high'")
];

const updateTaskValidator = [
  param('id').isUUID().withMessage('id must be a valid UUID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('title must be at least 3 characters long'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'done'])
    .withMessage("status must be one of 'pending', 'in_progress', 'done'"),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("priority must be one of 'low', 'medium', 'high'")
];

const getTaskByIdValidator = [
  param('id').isUUID().withMessage('id must be a valid UUID')
];

const listTasksValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'done'])
    .withMessage("status must be one of 'pending', 'in_progress', 'done'"),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("priority must be one of 'low', 'medium', 'high'"),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  getTaskByIdValidator,
  listTasksValidator
};

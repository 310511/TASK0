const express = require('express');
const authenticate = require('../../middleware/authenticate');
const validate = require('../../middleware/validate');
const tasksController = require('../../controllers/tasks.controller');
const {
  createTaskValidator,
  updateTaskValidator,
  getTaskByIdValidator,
  listTasksValidator
} = require('../../validators/tasks.validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *     description: Returns own tasks for users, and all tasks for admins.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, done]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error
 */
router.get('/', authenticate, listTasksValidator, validate, tasksController.listTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 *     description: Create a task assigned to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/', authenticate, createTaskValidator, validate, tasksController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
 *     description: Returns task if requester is owner or admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task detail
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.get('/:id', authenticate, getTaskByIdValidator, validate, tasksController.getTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update task
 *     description: Updates task if requester is owner or admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.patch('/:id', authenticate, updateTaskValidator, validate, tasksController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     description: Deletes task if requester is owner or admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.delete('/:id', authenticate, getTaskByIdValidator, validate, tasksController.deleteTask);

module.exports = router;

const express = require('express');
const authenticate = require('../../middleware/authenticate');
const authenticateToken = require('../../middleware/authenticateToken');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const authController = require('../../controllers/auth.controller');
const { registerValidator, updateRoleValidator } = require('../../validators/auth.validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register profile in database
 *     description: Creates the user's application profile after Firebase signup.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name]
 *             properties:
 *               full_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict
 *       422:
 *         description: Validation error
 */
router.post('/register', authenticateToken, registerValidator, validate, authController.register);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     description: Returns the current authenticated user profile from Supabase.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/me', authenticate, authController.me);

/**
 * @swagger
 * /api/v1/auth/role/{userId}:
 *   patch:
 *     tags: [Auth]
 *     summary: Update user role
 *     description: Admin-only endpoint to promote or demote a user role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation error
 */
router.patch('/role/:userId', authenticate, authorize('admin'), updateRoleValidator, validate, authController.patchRole);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     tags: [Auth]
 *     summary: List all users
 *     description: Admin-only endpoint to list users and roles.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/users', authenticate, authorize('admin'), authController.listUsers);

module.exports = router;

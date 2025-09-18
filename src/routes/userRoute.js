const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validator = require('../validators/userValidator');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "John Doe"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 isActive: true
 *                 lastLoginAt: "2025-09-17T10:00:00Z"
 *               - id: 2
 *                 name: "Jane Smith"
 *                 username: "janesmith"
 *                 email: "jane@example.com"
 *                 isActive: false
 *                 lastLoginAt: "2025-09-16T08:30:00Z"
 */
router.get('/', userController.getUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User data
 */
router.get('/:id', userController.getUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', validate(validator.user.joiSchema), userController.updateUser);

/**
 * @swagger
 * /user/change-password/{id}:
 *   put:
 *     summary: Change user password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *           example:
 *             oldPassword: "secret123"
 *             newPassword: "secret123444"
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/change-password/:id', validate(validator.changePassword.joiSchema), userController.changePassword);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;

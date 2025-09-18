const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const validator = require('../validators/userValidator');
const validate = require('../middlewares/validate');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Api Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
*           example:
 *             name: "John Doe"
 *             username: "johndoe"
 *             email: "john@example.com"
 *             password: "secret123"
 *     responses:
 *       200:
 *         description: Register user successfully
 */
router.post('/register', validate(validator.user.joiSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
*           example:
 *             username: "johndoe"
 *             password: "secret123"
 *     responses:
 *       200:
 *         description: Login Success
 */
router.post('/login', validate(validator.login.joiSchema), authController.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get profile success
 */
router.get('/profile', auth.me, authController.profile);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Logout success.
 */
router.post('/logout', authController.logout);

module.exports = router;
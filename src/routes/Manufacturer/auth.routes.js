const express = require("express");
const { manufacturerLoginValidation } = require("../../validation/manufacturer/manufacturerAuthValidation");
const { manufacturerLogin, manufacturerLogout, getManufacturerByToken, forgotPassword, resetPassword } = require("../../controller/Manufacturer/auth.controller");
const { manufacturerRefreshTokenHandler } = require("../../helpers/refreshTokenHandle");
const { manufacturerAuthMiddleware } = require("../../middleware/manufacturer/manufacturerAuthMiddleware");
const router = express.Router();

router.post("/login", manufacturerLoginValidation, manufacturerLogin);
router.post("/refresh-token", manufacturerRefreshTokenHandler);
router.get("/token", manufacturerAuthMiddleware, getManufacturerByToken);
router.post("/logout", manufacturerLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


/**
 * @swagger
 * tags:
 *   name: Manufacturer Auth
 *   description: Manufacturer authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Manufacturer login
 *     tags: [Manufacturer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: manufacturer@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid password
 *       403:
 *         description: Account blocked
 *       404:
 *         description: Invalid email
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Manufacturer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Get manufacturer details by token
 *     tags: [Manufacturer Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manufacturer details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Manufacturer details
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Manufacturer logout
 *     tags: [Manufacturer Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send forgot password mail
 *     tags: [Manufacturer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: manufacturer@gmail.com
 *     responses:
 *       200:
 *         description: Password reset mail sent successfully
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset manufacturer password
 *     tags: [Manufacturer Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: dshjdsjhdsjhdjshdjshd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: Manufacturer not found
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
module.exports = router;
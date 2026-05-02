
const express = require("express");
const { operatorLoginValidation, } = require("../../validation/operator/operatorAuthValidation");
const { operatorLogin, operatorLogout, getOperatorByToken, forgotPassword, resetPassword, } = require("../../controller/Operator/auth.controller");
const { operatorRefreshTokenHandler, } = require("../../helpers/refreshTokenHandle");
const { operatorAuthMiddleware, } = require("../../middleware/operator/operatorAuthMiddleware");
const router = express.Router();


router.post("/login", operatorLoginValidation, operatorLogin);
router.post("/refresh-token", operatorRefreshTokenHandler);
router.get("/", operatorAuthMiddleware, getOperatorByToken);
router.post("/logout", operatorLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


/**
 * @swagger
 * tags:
 *   name: Operator Auth
 *   description: Operator authentication APIs
 */

/**
 * @swagger
 * /v1/operator/auth/login:
 *   post:
 *     summary: Operator login
 *     tags: [Operator Auth]
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
 *                 example: operator@gmail.com
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
 * /v1/operator/auth/refresh-token:
 *   post:
 *     summary: Refresh operator access token
 *     tags: [Operator Auth]
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
 * /v1/operator/auth:
 *   get:
 *     summary: Get operator details by token
 *     tags: [Operator Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operator details fetched successfully
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
 *                   example: Operator details
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/auth/logout:
 *   post:
 *     summary: Operator logout
 *     tags: [Operator Auth]
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
 * /v1/operator/auth/forgot-password:
 *   post:
 *     summary: Send operator forgot password mail
 *     tags: [Operator Auth]
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
 *                 example: operator@gmail.com
 *     responses:
 *       200:
 *         description: Password reset mail sent successfully
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /v1/operator/auth/reset-password/{token}:
 *   post:
 *     summary: Reset operator password
 *     tags: [Operator Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: token123456
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
 *         description: Operator not found
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

const express = require("express");

const router = express.Router();

const { distributorLoginValidation, } = require("../../validation/distributor/distributorAuthValidation");
const { distributorLogin, distributorLogout, getDistributorByToken, forgotPassword, resetPassword, } = require("../../controller/Distributor/auth.controller");
const { distributorRefreshTokenHandler, } = require("../../helpers/refreshTokenHandle");
const { distributorAuthMiddleware, } = require("../../middleware/distributor/distributorAuthMiddleware");

router.post("/login", distributorLoginValidation, distributorLogin);

router.post("/refresh-token", distributorRefreshTokenHandler);
router.get("/", distributorAuthMiddleware, getDistributorByToken);
router.post("/logout", distributorLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * tags:
 *   name: Distributor Auth
 *   description: Distributor authentication APIs
 */

/**
 * @swagger
 * /v1/distributor/auth/login:
 *   post:
 *     summary: Distributor login
 *     tags: [Distributor Auth]
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
 *                 example: distributor@gmail.com
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
 * /v1/distributor/auth/refresh-token:
 *   post:
 *     summary: Refresh distributor access token
 *     tags: [Distributor Auth]
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
 * /v1/distributor/auth:
 *   get:
 *     summary: Get distributor details by token
 *     tags: [Distributor Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Distributor details fetched successfully
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
 *                   example: Distributor details
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/distributor/auth/logout:
 *   post:
 *     summary: Distributor logout
 *     tags: [Distributor Auth]
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
 * /v1/distributor/auth/forgot-password:
 *   post:
 *     summary: Send distributor forgot password mail
 *     tags: [Distributor Auth]
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
 *                 example: distributor@gmail.com
 *     responses:
 *       200:
 *         description: Password reset mail sent successfully
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /v1/distributor/auth/reset-password/{token}:
 *   post:
 *     summary: Reset distributor password
 *     tags: [Distributor Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: asd123asd123asd
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
 *         description: Distributor not found
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
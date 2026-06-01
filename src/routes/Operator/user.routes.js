
const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, getAllRfidCardsByUserId, userWalletTransaction, userCallLogsList, suggestDuplicatePhoneNumbers } = require("../../controller/Operator/user.controller");
const { createUserValidation, updateUserValidation } = require("../../validation/operator/userValidation");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/rfid-cards", getAllRfidCardsByUserId);
router.get("/:id/wallet-transactions", userWalletTransaction);
router.get("/:id/call-logs", userCallLogsList);
router.get("/duplicate-numbers", suggestDuplicatePhoneNumbers);
router.post("/", createUserValidation, createUser);
router.put("/:id", updateUserValidation, updateUser);



/**
 * @swagger
 * tags:
 *   name: Operator User
 *   description: Operator user management APIs
 */

/**
 * @swagger
 * /v1/operator/user:
 *   get:
 *     summary: Get all users
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: John
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: Active
 *     responses:
 *       200:
 *         description: User list fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/user/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/operator/user:
 *   post:
 *     summary: Create new user
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               callDurationLimit:
 *                 type: integer
 *                 example: 60
 *               activeFrom:
 *                 type: string
 *                 format: date
 *                 example: 2026-05-01
 *               activeTo:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               associatedNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["9876543210", "9123456780"]
 *               activeDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Monday", "Tuesday", "Friday"]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /v1/operator/user/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               callDurationLimit:
 *                 type: integer
 *                 example: 120
 *               activeFrom:
 *                 type: string
 *                 format: date
 *               activeTo:
 *                 type: string
 *                 format: date
 *               associatedNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *               activeDays:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/operator/user/{id}/rfid-cards:
 *   get:
 *     summary: Get all RFID cards by user ID
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: RFID cards fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /v1/operator/user/{id}/wallet-transactions:
 *   get:
 *     summary: Get wallet transactions by user ID
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Credit, Debit]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: WTX12345
 *     responses:
 *       200:
 *         description: Wallet transactions fetched successfully
 */

/**
 * @swagger
 * /v1/operator/user/{id}/call-logs:
 *   get:
 *     summary: Get call logs by user ID
 *     tags: [Operator User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         example: OUTGOING
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: 9876543210
 *     responses:
 *       200:
 *         description: Call logs fetched successfully
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
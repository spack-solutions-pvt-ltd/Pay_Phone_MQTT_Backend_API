
const express = require("express");
const { createOperatorValidation, updateOperatorValidation, rechargeOperatorWalletValidation } = require("../../validation/distributor/operatorValidation");
const { createOperator, getAllOperators, getOperatorById, updateOperator, reachargeOperatorWallet, getOperatorWalletTransactions, getOperatorDashboardCards, updateStatus } = require("../../controller/Distributor/operator.controller");
const router = express.Router();


router.get("/", getAllOperators);
router.get("/:id", getOperatorById);
router.post("/", createOperatorValidation, createOperator);
router.put("/:id", updateOperatorValidation, updateOperator);
router.patch("/status/:id", updateStatus);
router.post("/wallet-recharge", rechargeOperatorWalletValidation, reachargeOperatorWallet);
router.get("/wallet-transactions/:operatorId", getOperatorWalletTransactions);
router.get("/dashboard-cards/:operatorId", getOperatorDashboardCards);

/**
 * @swagger
 * tags:
 *   name: Distributor Operator
 *   description: Distributor operator management APIs
 */

/**
 * @swagger
 * /v1/distributor/operator:
 *   get:
 *     summary: Get all operators
 *     tags: [Distributor Operator]
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
 *         example: operator
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Blocked]
 *         example: Active
 *     responses:
 *       200:
 *         description: Operator list fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/distributor/operator/{id}:
 *   get:
 *     summary: Get operator by ID
 *     tags: [Distributor Operator]
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
 *         description: Operator details fetched successfully
 *       404:
 *         description: Operator not found
 */

/**
 * @swagger
 * /v1/distributor/operator:
 *   post:
 *     summary: Create operator
 *     tags: [Distributor Operator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - companyName
 *               - gstNumber
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Operator
 *               email:
 *                 type: string
 *                 example: operator@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               companyName:
 *                 type: string
 *                 example: XYZ Operator Pvt Ltd
 *               gstNumber:
 *                 type: string
 *                 example: 22AAAAA0000A1Z5
 *               location:
 *                 type: string
 *                 example: Hyderabad
 *     responses:
 *       201:
 *         description: Operator created successfully
 *       400:
 *         description: Operator already exists
 */

/**
 * @swagger
 * /v1/distributor/operator/{id}:
 *   put:
 *     summary: Update operator
 *     tags: [Distributor Operator]
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
 *               name:
 *                 type: string
 *                 example: Updated Operator
 *               email:
 *                 type: string
 *                 example: updated@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               companyName:
 *                 type: string
 *                 example: Updated Company Pvt Ltd
 *               gstNumber:
 *                 type: string
 *                 example: 22AAAAA0000A1Z5
 *               location:
 *                 type: string
 *                 example: Chennai
 *               status:
 *                 type: string
 *                 enum: [Active, Blocked]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Operator updated successfully
 *       404:
 *         description: Operator not found
 */

/**
 * @swagger
 * /v1/distributor/operator/status/{id}:
 *   patch:
 *     summary: Update operator status
 *     tags: [Distributor Operator]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Blocked]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Operator status updated successfully
 *       404:
 *         description: Operator not found
 */

/**
 * @swagger
 * /v1/distributor/operator/wallet-recharge}:
 *   post:
 *     summary: Recharge operator wallet
 *     tags: [Distributor Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operatorId
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
 *             required:
 *               - amount
 *               - type
 *             properties:
 *              operatorId:
 *                type: integer
 *                example: 1
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [Credit, Debit]
 *                 example: Credit
 *               paymentMode:
 *                 type: string
 *                 example: UPI
 *     responses:
 *       200:
 *         description: Wallet updated successfully
 *       400:
 *         description: Invalid request or insufficient balance
 *       404:
 *         description: Operator not found
 */

/**
 * @swagger
 * /v1/distributor/operator/wallet-transactions/{operatorId}:
 *   get:
 *     summary: Get operator wallet transactions
 *     tags: [Distributor Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operatorId
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
 *         example: Credit
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: string
 *         example: ADD_FUNDS
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: WTX
 *     responses:
 *       200:
 *         description: Wallet transaction list fetched successfully
 *       404:
 *         description: Operator or wallet not found
 */

/**
 * @swagger
 * /v1/distributor/operator/dashboard-cards/{operatorId}:
 *   get:
 *     summary: Get operator dashboard cards
 *     tags: [Distributor Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operatorId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Operator dashboard cards fetched successfully
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
 *                   example: Operator dashboard cards
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBalance:
 *                       type: number
 *                       example: 50000
 *                     totalTerminals:
 *                       type: integer
 *                       example: 25
 *                     totalUsers:
 *                       type: integer
 *                       example: 120
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
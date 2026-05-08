const express = require("express");
const { rechargeUserWallet, rechargerdWalletTranactions, walletTranactions } = require("../../controller/Operator/wallet.controller");
const { rechargeUserWalletValidation } = require("../../validation/operator/userWalletValidation");

const router = express.Router();

router.get("/", walletTranactions)
router.get("/recharge", rechargerdWalletTranactions)
router.post("/user-recharge", rechargeUserWalletValidation, rechargeUserWallet);


/**
 * @swagger
 * tags:
 *   name: Operator Wallet
 *   description: Operator wallet management APIs
 */

/**
 * @swagger
 * /v1/operator/wallet:
 *   get:
 *     summary: Get operator wallet transactions
 *     tags: [Operator Wallet]
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
 *         example: UTX1001
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Credit, Debit]
 *         example: Credit
 *     responses:
 *       200:
 *         description: Wallet transactions fetched successfully
 *       404:
 *         description: Operator wallet not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/wallet/recharge:
 *   get:
 *     summary: Get recharge wallet transactions
 *     tags: [Operator Wallet]
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
 *         example: WTX1001
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Credit, Debit]
 *         example: Credit
 *     responses:
 *       200:
 *         description: Recharge wallet transactions fetched successfully
 *       404:
 *         description: Operator wallet not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/wallet/user-recharge:
 *   post:
 *     summary: Recharge user wallet
 *     tags: [Operator Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *               - type
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 500
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
 *                   example: Wallet credited successfully
 *       400:
 *         description: Invalid request or insufficient balance
 *       404:
 *         description: User or operator wallet not found
 *       401:
 *         description: Unauthorized
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
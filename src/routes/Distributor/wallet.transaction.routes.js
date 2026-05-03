const express = require("express");
const { getDistributorWalletTransactions } = require("../../controller/Distributor/wallet.transaction.controller");


const router = express.Router();

router.get("/", getDistributorWalletTransactions);

/**
 * @swagger
 * tags:
 *   name: Distributor Wallet Transactions
 *   description: Distributor wallet transaction APIs
 */

/**
 * @swagger
 * /v1/distributor/wallet-transactions:
 *   get:
 *     summary: Get distributor wallet transactions
 *     tags: [Distributor Wallet Transactions]
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
 *         name: operatorId
 *         schema:
 *           type: integer
 *         example: 1
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
 *           example: ADD_FUNDS
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: WTX
 *     responses:
 *       200:
 *         description: Wallet transaction list fetched successfully
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
 *                   example: Wallet transaction list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       transactionId:
 *                         type: string
 *                         example: WTX1714747474
 *                       amount:
 *                         type: number
 *                         example: 5000
 *                       type:
 *                         type: string
 *                         example: Credit
 *                       remainingBalance:
 *                         type: number
 *                         example: 15000
 *                       transactionType:
 *                         type: string
 *                         example: ADD_FUNDS
 *                       paymentMode:
 *                         type: string
 *                         example: UPI
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
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
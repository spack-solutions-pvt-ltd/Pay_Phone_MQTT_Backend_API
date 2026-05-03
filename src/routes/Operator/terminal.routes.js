
const express = require("express");
const { getAllOperatorTerminals, getTerminalById, getCallListByTerminalId } = require("../../controller/Operator/terminal.controller");

const router = express.Router();

router.get("/",getAllOperatorTerminals);
router.get("/:id",getTerminalById);
router.get("/call-list/:terminalId",getCallListByTerminalId);


/**
 * @swagger
 * tags:
 *   name: Operator Terminal
 *   description: Operator terminal management APIs
 */

/**
 * @swagger
 * /v1/operator/terminal:
 *   get:
 *     summary: Get all operator terminals
 *     tags: [Operator Terminal]
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
 *         example: TRM1001
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive, Disconnected, Faulted]
 *         example: Active
 *     responses:
 *       200:
 *         description: Terminal list fetched successfully
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
 *                   example: Terminal list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
 */

/**
 * @swagger
 * /v1/operator/terminal/{terminalId}:
 *   get:
 *     summary: Get terminal details by ID
 *     tags: [Operator Terminal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: terminalId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Terminal details fetched successfully
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
 *                   example: Terminal details
 *                 data:
 *                   type: object
 *       404:
 *         description: Terminal not found
 */

/**
 * @swagger
 * /v1/operator/terminal/call-list/{terminalId}:
 *   get:
 *     summary: Get call list by terminal ID
 *     tags: [Operator Terminal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: terminalId
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
 *         name: search
 *         schema:
 *           type: string
 *         example: 9876543210
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: Completed
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-05-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-05-31
 *     responses:
 *       200:
 *         description: Call list fetched successfully
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
 *                   example: Call list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       caller:
 *                         type: string
 *                         example: 9876543210
 *                       receiver:
 *                         type: string
 *                         example: 9123456780
 *                       callType:
 *                         type: string
 *                         example: OUTGOING
 *                       duration:
 *                         type: integer
 *                         example: 120
 *                       status:
 *                         type: string
 *                         example: Completed
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           userId:
 *                             type: string
 *                             example: USR1001
 *       404:
 *         description: Terminal not found
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
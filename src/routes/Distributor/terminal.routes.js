
const express = require("express");
const { getAllDistributorTerminals, getDistributorTerminalById, createDistributorTerminal, updateDistributorTerminal, statusUpdateDistributorTerminal, getAllNonAssociatedTerminals, getAllCallsListByTerminal } = require("../../controller/Distributor/terminal.controller");
const { updateTerminalValidation, createTerminalValidation } = require("../../validation/distributor/terminalValidation");

const router = express.Router();


router.get("/", getAllDistributorTerminals);
router.get("/non-associated", getAllNonAssociatedTerminals);
router.get("/calls/:id", getAllCallsListByTerminal);
router.get("/:id", getDistributorTerminalById);
router.post("/", createTerminalValidation, createDistributorTerminal);
router.put("/:id", updateTerminalValidation, updateDistributorTerminal);
router.patch("/:id/status", updateTerminalValidation, statusUpdateDistributorTerminal);


/**
 * @swagger
 * tags:
 *   name: Distributor Terminal
 *   description: Distributor terminal management APIs
 */

/**
 * @swagger
 * /v1/distributor/terminal:
 *   get:
 *     summary: Get all distributor terminals
 *     tags: [Distributor Terminal]
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
 *         name: operatorId
 *         schema:
 *           type: integer
 *         example: 1
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
 * /v1/distributor/terminal/{id}:
 *   get:
 *     summary: Get distributor terminal by ID
 *     tags: [Distributor Terminal]
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
 *         description: Terminal details fetched successfully
 *       404:
 *         description: Terminal not found
 */

/**
 * @swagger
 * /v1/distributor/terminal:
 *   post:
 *     summary: Create distributor terminal
 *     tags: [Distributor Terminal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNo
 *               - operatorId
 *               - campus
 *               - location
 *               - firmwareVersion
 *             properties:
 *               serialNo:
 *                 type: string
 *                 example: SN123456789
 *               operatorId:
 *                 type: integer
 *                 example: 1
 *               campus:
 *                 type: string
 *                 example: Main Campus
 *               location:
 *                 type: string
 *                 example: Hyderabad
 *               firmwareVersion:
 *                 type: string
 *                 example: v1.0.0
 *     responses:
 *       201:
 *         description: Terminal created successfully
 *       400:
 *         description: Serial number already exists
 */

/**
 * @swagger
 * /v1/distributor/terminal/{id}:
 *   put:
 *     summary: Update distributor terminal
 *     tags: [Distributor Terminal]
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
 *               serialNo:
 *                 type: string
 *                 example: SN123456789
 *               operatorId:
 *                 type: integer
 *                 example: 1
 *               campus:
 *                 type: string
 *                 example: Main Campus
 *               location:
 *                 type: string
 *                 example: Chennai
 *               firmwareVersion:
 *                 type: string
 *                 example: v1.0.1
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Disconnected, Faulted]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Terminal updated successfully
 *       404:
 *         description: Terminal not found
 */

/**
 * @swagger
 * /v1/distributor/terminal/{id}/status:
 *   patch:
 *     summary: Update distributor terminal status
 *     tags: [Distributor Terminal]
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
 *                 enum: [Active, Inactive, Disconnected, Faulted]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Terminal status updated successfully
 *       404:
 *         description: Terminal not found
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
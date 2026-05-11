
const express = require("express");
const { createTerminalValidation, updateTerminalValidation } = require("../../validation/manufacturer/terminalValidation");
const { createTerminal, getAllTerminals, getTerminalById, updateTerminal, statusUpdateTerminal } = require("../../controller/Manufacturer/terminal.controller");

const router = express.Router();


router.get("/", getAllTerminals);
router.get("/:id", getTerminalById);
router.post("/", createTerminalValidation, createTerminal);
router.put("/:id", updateTerminalValidation, updateTerminal);
router.patch("/:id", statusUpdateTerminal);

/**
 * @swagger
 * tags:
 *   name: Manufacturer Terminal
 *   description: Manufacturer terminal management APIs
 */

/**
 * @swagger
 * /v1/manufacturer/terminal:
 *   get:
 *     summary: Get all terminals
 *     tags: [Manufacturer Terminal]
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
 *         name: distributorId
 *         schema:
 *           type: integer
 *         example: 1
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
 * /v1/manufacturer/terminal/{id}:
 *   get:
 *     summary: Get terminal by ID
 *     tags: [Manufacturer Terminal]
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
 * /v1/manufacturer/terminal:
 *   post:
 *     summary: Create terminal
 *     tags: [Manufacturer Terminal]
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
 *               - distributorId
 *               - operatorId
 *               - campus
 *               - location
 *               - firmwareVersion
 *             properties:
 *               serialNo:
 *                 type: string
 *                 example: SN123456789
 *               distributorId:
 *                 type: integer
 *                 example: 1
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
 *                   example: Terminal created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Serial number already exists
 */

/**
 * @swagger
 * /v1/manufacturer/terminal/{id}:
 *   put:
 *     summary: Update terminal
 *     tags: [Manufacturer Terminal]
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
 *               distributorId:
 *                 type: integer
 *                 example: 1
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
 *                   example: Terminal updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Terminal not found
 */


/**
 * @swagger
 * /v1/manufacturer/terminal/{id}:
 *   patch:
 *     summary: Update terminal status
 *     tags: [Manufacturer Terminal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Terminal ID
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
 *                 enum: [Active, Inactive, Blocked]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Terminal status updated successfully
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
 *                   example: Terminal status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     terminalId:
 *                       type: string
 *                       example: TRM1001
 *                     serialNo:
 *                       type: string
 *                       example: SN123456
 *                     status:
 *                       type: string
 *                       example: Active
 *       404:
 *         description: Terminal not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
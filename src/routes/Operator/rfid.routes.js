const express = require("express");
const { createUserRfid, updateRfidById, getRfidById, getAllRfids } = require("../../controller/Operator/Rfid.controller");
const { createRfidValidation, updateRfidValidation } = require("../../validation/operator/rfidValidation");
const router = express.Router();

router.get("/", getAllRfids);
router.get("/:id", getRfidById);
router.post("/", createRfidValidation, createUserRfid);
router.put("/:id", updateRfidValidation, updateRfidById);


/**
 * @swagger
 * tags:
 *   name: Operator RFID
 *   description: Operator RFID card management APIs
 */

/**
 * @swagger
 * /v1/operator/rfid:
 *   get:
 *     summary: Get all RFID cards
 *     tags: [Operator RFID]
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
 *         example: RFID1001
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         example: Active
 *     responses:
 *       200:
 *         description: RFID card list fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/rfid/{id}:
 *   get:
 *     summary: Get RFID card by ID
 *     tags: [Operator RFID]
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
 *         description: RFID card fetched successfully
 *       404:
 *         description: RFID card not found
 */

/**
 * @swagger
 * /v1/operator/rfid:
 *   post:
 *     summary: Create RFID card
 *     tags: [Operator RFID]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - userId
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 example: RFID123456
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: RFID card created successfully
 *       400:
 *         description: RFID card already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /v1/operator/rfid/{id}:
 *   put:
 *     summary: Update RFID card
 *     tags: [Operator RFID]
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
 *               cardNumber:
 *                 type: string
 *                 example: RFID123456
 *               status:
 *                 type: string
 *                 example: Active
 *     responses:
 *       200:
 *         description: RFID card updated successfully
 *       404:
 *         description: RFID card not found
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
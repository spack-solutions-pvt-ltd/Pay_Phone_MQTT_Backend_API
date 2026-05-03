
const express = require("express");
const { getOperatorsByDistributorId } = require("../../controller/Manufacturer/operator.controller");
const router = express.Router();

router.get("/:distributorId", getOperatorsByDistributorId);

/**
 * @swagger
 * tags:
 *   name: Manufacturer Operator
 *   description: Manufacturer operator management APIs
 */

/**
 * @swagger
 * /v1/manufacturer/operator/{distributorId}:
 *   get:
 *     summary: Get operators by distributor ID
 *     tags: [Manufacturer Operator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: distributorId
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
 *                   example: Operator list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Distributor not found
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
const express = require("express");
const { getOperatorDashboardCards, getUnavailableTerminals } = require("../../controller/Operator/dashboard.controller");

const router = express.Router();

router.get("/cards", getOperatorDashboardCards);
router.get("/unavailable-terminals", getUnavailableTerminals);

/**
 * @swagger
 * /v1/operator/dashboard/cards:
 *   get:
 *     summary: Get operator dashboard cards
 *     tags: [Operator Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard cards fetched successfully
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
 *                   example: Dashboard cards data
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTerminals:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 10
 *                     activeTerminals:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 7
 *                         growth:
 *                           type: string
 *                           example: "+2 this week"
 *                     totalUsers:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 120
 *                         growth:
 *                           type: string
 *                           example: "+18 MTD"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

module.exports = router;
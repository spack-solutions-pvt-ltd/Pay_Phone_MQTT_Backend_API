const express = require("express");
const { getDashboardCards } = require("../../controller/Manufacturer/dashboard.controller");

const router = express.Router();


router.get("/cards", getDashboardCards);


/**
 * @swagger
 * tags:
 *   name: Manufacturer Dashboard
 *   description: Manufacturer dashboard APIs
 */

/**
 * @swagger
 * /v1/manufacturer/dashboard/cards:
 *   get:
 *     summary: Get dashboard cards data
 *     tags: [Manufacturer Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard cards data fetched successfully
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
 *                     distributors:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 42
 *                         newThisMonth:
 *                           type: integer
 *                           example: 3
 *                     operators:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 318
 *                         newThisMonth:
 *                           type: integer
 *                           example: 12
 *                     terminals:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 12482
 *                         newThisWeek:
 *                           type: integer
 *                           example: 48
 *                     users:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 84271
 *                         newThisWeek:
 *                           type: integer
 *                           example: 1200
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
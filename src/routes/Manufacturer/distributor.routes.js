
const express = require("express");

const { createDistributor, getAllDistributors, getDistributorById, updateDistributor, updateStatusDistributor, } = require("../../controller/Manufacturer/distributor.controller");
const { createDistributorValidation, updateDistributorValidation } = require("../../validation/manufacturer/distributorValidation");
const router = express.Router();


router.get("/", getAllDistributors);
router.get("/:id", getDistributorById);
router.post("/", createDistributorValidation, createDistributor);
router.put("/:id", updateDistributorValidation, updateDistributor);
router.patch("/:id", updateStatusDistributor);


/**
 * @swagger
 * tags:
 *   name: Manufacturer Distributor
 *   description: Manufacturer distributor management APIs
 */

/**
 * @swagger
 * /v1/manufacturer/distributor:
 *   get:
 *     summary: Get all distributors
 *     tags: [Manufacturer Distributor]
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
 *         example: distributor
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Blocked]
 *         example: Active
 *     responses:
 *       200:
 *         description: Distributor list fetched successfully
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
 *                   example: Distributor list
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
 */

/**
 * @swagger
 * /v1/manufacturer/distributor/{id}:
 *   get:
 *     summary: Get distributor by ID
 *     tags: [Manufacturer Distributor]
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
 *         description: Distributor details fetched successfully
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
 *                   example: Distributor details
 *                 data:
 *                   type: object
 *       404:
 *         description: Distributor not found
 */

/**
 * @swagger
 * /v1/manufacturer/distributor:
 *   post:
 *     summary: Create distributor
 *     tags: [Manufacturer Distributor]
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
 *                 example: John Distributor
 *               email:
 *                 type: string
 *                 example: distributor@gmail.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               companyName:
 *                 type: string
 *                 example: ABC Distributors Pvt Ltd
 *               gstNumber:
 *                 type: string
 *                 example: 22AAAAA0000A1Z5
 *               location:
 *                 type: string
 *                 example: Hyderabad
 *     responses:
 *       201:
 *         description: Distributor created successfully
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
 *                   example: Distributor created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Distributor already exists
 */

/**
 * @swagger
 * /v1/manufacturer/distributor/{id}:
 *   put:
 *     summary: Update distributor
 *     tags: [Manufacturer Distributor]
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
 *                 example: Updated Distributor
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
 *         description: Distributor updated successfully
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
 *                   example: Distributor updated successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Distributor not found
 */


/**
 * @swagger
 * /v1/manufacturer/distributor/{id}:
 *   patch:
 *     summary: Update distributor status
 *     tags: [Manufacturer Distributor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Distributor ID
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
 *         description: Distributor status updated successfully
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
 *                   example: Distributor Status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     distributorId:
 *                       type: string
 *                       example: DST1001
 *                     name:
 *                       type: string
 *                       example: ABC Distributor
 *                     email:
 *                       type: string
 *                       example: distributor@example.com
 *                     phone:
 *                       type: string
 *                       example: "9876543210"
 *                     status:
 *                       type: string
 *                       example: Active
 *       404:
 *         description: Distributor not found
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
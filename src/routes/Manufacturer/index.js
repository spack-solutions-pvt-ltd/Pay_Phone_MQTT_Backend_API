const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const distributorRoutes = require("./distributor.routes");
const operatorRoutes = require("./operator.routes");
const terminalRoutes = require("./terminal.routes");
const dashboardRoutes = require("./dashboard.routes");
const { manufacturerAuthMiddleware } = require("../../middleware/manufacturer/manufacturerAuthMiddleware");
const walletTransactionRoutes = require("./wallet.transaction.routes");


router.use("/auth", authRoutes);
router.use("/distributor", manufacturerAuthMiddleware, distributorRoutes);
router.use("/operator", manufacturerAuthMiddleware, operatorRoutes);
router.use("/terminal", manufacturerAuthMiddleware, terminalRoutes);
router.use("/dashboard", manufacturerAuthMiddleware, dashboardRoutes);
router.use("/wallet-transactions", manufacturerAuthMiddleware, walletTransactionRoutes);

module.exports = router;
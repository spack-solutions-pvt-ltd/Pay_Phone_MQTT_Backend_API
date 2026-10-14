const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const operatorRoutes = require("./operator.routes");
const { distributorAuthMiddleware } = require("../../middleware/distributor/distributorAuthMiddleware");
const terminalRoutes = require("./terminal.routes");
const walletTransactionRoutes = require("./wallet.transaction.routes");
const dashboardRoutes = require("./dashboard.routes");
const callHistoryRoutes = require("./call.hsitory.route");


router.use("/auth", authRoutes);
router.use("/operator", distributorAuthMiddleware, operatorRoutes);
router.use("/terminal", distributorAuthMiddleware, terminalRoutes);
router.use("/wallet-transactions", distributorAuthMiddleware, walletTransactionRoutes);
router.use("/dashboard", distributorAuthMiddleware, dashboardRoutes);
router.use("/call-history", distributorAuthMiddleware, callHistoryRoutes);

module.exports = router;
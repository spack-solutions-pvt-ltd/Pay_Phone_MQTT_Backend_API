const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const operatorRoutes = require("./operator.routes");
const { distributorAuthMiddleware } = require("../../middleware/distributor/distributorAuthMiddleware");
const terminalRoutes = require("./terminal.routes");
const walletTransactionRoutes = require("./wallet.transaction.routes");


router.use("/auth", authRoutes);
router.use("/operator", distributorAuthMiddleware, operatorRoutes);
router.use("/terminal", distributorAuthMiddleware, terminalRoutes);
router.use("/wallet-transactions", distributorAuthMiddleware, walletTransactionRoutes);

module.exports = router;
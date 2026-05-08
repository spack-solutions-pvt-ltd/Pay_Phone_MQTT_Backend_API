const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const terminalRoutes = require("./terminal.routes");
const { operatorAuthMiddleware } = require("../../middleware/operator/operatorAuthMiddleware");
const userRoutes = require("./user.routes");
const walletRoutes = require("./wallet.routes")
const rfidRoutes = require("./rfid.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/auth", authRoutes);
router.use("/terminal", operatorAuthMiddleware, terminalRoutes);
router.use("/user", operatorAuthMiddleware, userRoutes);
router.use("/wallet", operatorAuthMiddleware, walletRoutes);
router.use("/rfid", operatorAuthMiddleware, rfidRoutes);
router.use("/dashboard", operatorAuthMiddleware, dashboardRoutes);

module.exports = router;
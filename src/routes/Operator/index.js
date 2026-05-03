const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const terminalRoutes = require("./terminal.routes");
const { operatorAuthMiddleware } = require("../../middleware/operator/operatorAuthMiddleware");

router.use("/auth", authRoutes);
router.use("/terminal",operatorAuthMiddleware, terminalRoutes);

module.exports = router;
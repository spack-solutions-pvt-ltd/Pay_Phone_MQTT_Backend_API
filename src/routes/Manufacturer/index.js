const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const distributorRoutes = require("./distributor.routes");


router.use("/auth", authRoutes);
router.use("/distributor", distributorRoutes);

module.exports = router;
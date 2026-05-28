
const express = require("express");
const { distributorDashboard, getUnavailableTerminals } = require("../../controller/Distributor/dashboard.controller");

const router = express.Router();


router.get("/cards", distributorDashboard);
router.get("/unavailable-terminals", getUnavailableTerminals);

module.exports = router;
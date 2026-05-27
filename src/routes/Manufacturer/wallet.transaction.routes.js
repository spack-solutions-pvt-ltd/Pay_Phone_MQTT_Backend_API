const { getWalletTransactions } = require("../../controller/Manufacturer/wallet.transaction.controller");
const express = require("express");
const router = express.Router();

router.get("/", getWalletTransactions);

module.exports = router;
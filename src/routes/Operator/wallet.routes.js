const express = require("express");
const { rechargeUserWallet } = require("../../controller/Operator/wallet.controller");
const { rechargeUserWalletValidation } = require("../../validation/operator/userWalletValidation");

const router = express.Router();

router.post("/user-recharge", rechargeUserWalletValidation, rechargeUserWallet);


module.exports = router;
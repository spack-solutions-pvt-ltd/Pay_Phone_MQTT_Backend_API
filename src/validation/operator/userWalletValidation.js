
const { body } = require("express-validator");

const { validationMiddleware, } = require("../../middleware/validationMiddleware");

const rechargeUserWalletValidation = [
    body("userId").isInt().notEmpty().withMessage("User Id is required"),

    body("amount").notEmpty().withMessage("Amount is required")
        .isFloat({ min: 1, })
        .withMessage("Amount must be greater than 0"),

    body("type").notEmpty().withMessage("Type is required")
        .isIn(["Credit", "Debit",])
        .withMessage("Type must be Credit or Debit"),

    body("paymentMode").notEmpty()
        .withMessage("Payment mode is required"),

    validationMiddleware,
];

module.exports = {
    rechargeUserWalletValidation,
};
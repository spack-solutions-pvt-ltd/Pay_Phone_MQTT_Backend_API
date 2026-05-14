
const { body, param } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createOperatorValidation = [

    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("phone")
        .notEmpty()
        .withMessage("Phone is required"),

    body("companyName")
        .notEmpty()
        .withMessage("Company name is required"),

    body("gstNumber")
        .notEmpty()
        .withMessage("GST number is required"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),

    validationMiddleware,
];

const updateOperatorValidation = [

    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email"),

    validationMiddleware,
];

const rechargeOperatorWalletValidation = [

    body("operatorId")
        .notEmpty()
        .withMessage("Operator id is required")
        .isInt()
        .withMessage("Operator id must be number"),
    body("type")
        .notEmpty()
        .isIn(["Credit", "Debit"])
        .withMessage("Type is required"),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ min: 1, })
        .withMessage("Amount must be greater than 0"),

    validationMiddleware,
];
module.exports = {
    createOperatorValidation,
    updateOperatorValidation,
    rechargeOperatorWalletValidation
};
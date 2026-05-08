const { body } = require("express-validator");
const { validationMiddleware, } = require("../../middleware/validationMiddleware");

const createRfidValidation = [

    body("userId").notEmpty().withMessage("User id is required")
        .isInt().withMessage("Invalid user id"),

    body("cardNumber").notEmpty().withMessage("Card number is required"),

    validationMiddleware,
];

const updateRfidValidation = [

    body("userId").notEmpty().withMessage("User id is required")
        .isInt().withMessage("Invalid user id"),
    body("cardNumber").notEmpty().withMessage("Card number is required"),


    body("status").optional()
        .isIn([
            "Active",
            "Inactive",
            "Blocked",
            "Missing",
            "Lost",
            "Damaged",
            "Destroyed",
        ]).withMessage("Invalid status"),

    validationMiddleware,
];

module.exports = {
    createRfidValidation,
    updateRfidValidation,
};
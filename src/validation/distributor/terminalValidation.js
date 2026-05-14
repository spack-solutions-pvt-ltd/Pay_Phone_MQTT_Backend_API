
const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createTerminalValidation = [

    body("serialNo")
        .notEmpty()
        .withMessage("Serial number is required"),


    body("operatorId")
        .notEmpty()
        .withMessage("Operator id is required")
        .isNumeric()
        .withMessage("Operator id must be number"),

    body("campus")
        .notEmpty()
        .withMessage("Campus is required"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),


    validationMiddleware,
];

const updateTerminalValidation = [

    body("serialNo")
        .optional(),

    body("operatorId")
        .optional()
        .isNumeric()
        .withMessage("Operator id must be number"),

    validationMiddleware,
];

module.exports = {
    createTerminalValidation,
    updateTerminalValidation,
};
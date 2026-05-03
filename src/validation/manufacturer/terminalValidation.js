
const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createTerminalValidation = [

    body("serialNo")
        .notEmpty()
        .withMessage("Serial number is required"),

    body("distributorId")
        .notEmpty()
        .withMessage("Distributor id is required")
        .isNumeric()
        .withMessage("Distributor id must be number"),

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

    body("firmwareVersion")
        .notEmpty()
        .withMessage("Firmware version is required"),

    validationMiddleware,
];

const updateTerminalValidation = [

    body("serialNo")
        .optional(),

    body("distributorId")
        .optional()
        .isNumeric()
        .withMessage("Distributor id must be number"),

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
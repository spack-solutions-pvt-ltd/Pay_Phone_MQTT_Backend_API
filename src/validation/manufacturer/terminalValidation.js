
const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createTerminalValidation = [

    body("terminalId")
        .notEmpty()
        .withMessage("terminal Id  is required"),

    body("distributorId")
        .notEmpty()
        .withMessage("Distributor id is required")
        .isNumeric()
        .withMessage("Distributor id must be number"),


    validationMiddleware,
];

const updateTerminalValidation = [

    body("terminalId")
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

const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createTerminalValidation = [

    body("terminalId")
        .notEmpty()
        .withMessage("Terminal Id is required"),

    body("simNo")
        .notEmpty()
        .withMessage("Sim number is required"),

    body("operatorId")
        .notEmpty()
        .withMessage("Operator id is required")
        .isNumeric()
        .withMessage("Operator id must be number"),

    body("location")
        .notEmpty()
        .withMessage("Location is required"),


    validationMiddleware,
];

const updateTerminalValidation = [
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
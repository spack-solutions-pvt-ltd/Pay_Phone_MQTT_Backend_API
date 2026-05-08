

const { body } = require("express-validator");
const { validationMiddleware, } = require("../../middleware/validationMiddleware");

const createUserValidation = [

    body("fullName").notEmpty().withMessage("Full name is required"),

    body("phone").notEmpty().withMessage("Phone number is required"),

    body("callDurationLimit").notEmpty().withMessage("Call duration limit is required")
        .isNumeric().withMessage("Call duration limit must be number"),

    body("activeFrom").notEmpty().withMessage("Active from time is required"),

    body("activeTo").notEmpty().withMessage("Active to time is required"),

    body("associatedNumbers").isArray().withMessage("Associated numbers must be array"),

    body("activeDays").isArray().withMessage("Active days must be array"),

    validationMiddleware,
];

const updateUserValidation = [

    body("fullName").notEmpty().withMessage("Full name is required"),

    body("callDurationLimit").notEmpty().withMessage("Call duration limit is required")
        .isNumeric().withMessage("Call duration limit must be number"),

    body("activeFrom").notEmpty().withMessage("Active from time is required"),

    body("activeTo").notEmpty().withMessage("Active to time is required"),

    body("associatedNumbers").isArray().withMessage("Associated numbers must be array"),

    body("activeDays").isArray().withMessage("Active days must be array"),

    validationMiddleware,
];

module.exports = {
    createUserValidation,
    updateUserValidation,
};
// validation/operator/operatorAuthValidation.js

const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const operatorLoginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validationMiddleware,
];

module.exports = {
    operatorLoginValidation,
};
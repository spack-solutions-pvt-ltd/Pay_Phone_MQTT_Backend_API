// validation/distributor/distributorValidation.js

const { body } = require("express-validator");
const { validationMiddleware } = require("../../middleware/validationMiddleware");

const createDistributorValidation = [
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

const updateDistributorValidation = [
    body("name")
        .optional(),

    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email"),

    validationMiddleware,
];

module.exports = {
    createDistributorValidation,
    updateDistributorValidation,
};
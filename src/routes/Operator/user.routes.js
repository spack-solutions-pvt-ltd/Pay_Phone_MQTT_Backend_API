
const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser } = require("../../controller/Operator/user.controller");
const { createUserValidation, updateUserValidation } = require("../../validation/operator/userValidation");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidation, createUser);
router.put("/:id", updateUserValidation, updateUser);


module.exports = router;
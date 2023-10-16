const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login-user", authController.loginUser);
// router.post("/login-admin", authController.loginAdmin);

module.exports = router;

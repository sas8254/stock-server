const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.patch("/change-password/:Id",authMiddleware.isUser, userController.changePassword);

module.exports = router;

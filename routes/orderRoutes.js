const express = require("express");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/place-order", orderController.placeLimtOrder);

// router.patch("/change-password/:Id",authMiddleware.isUser, userController.changePassword);
// router.post("/gen-session", authMiddleware.isUser, userController.genSession);
// router.post("/sign-up", userController.signUp);
// router.patch("/edit-self/", authMiddleware.isUser, userController.editSelf);

module.exports = router;

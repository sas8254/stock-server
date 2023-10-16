const express = require("express");
const userController = require("../controllers/adminController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/AddUser",authMiddleware.isAdmin, userController.addUser);

router.get("/get-all-users",authMiddleware.isAdmin, userController.getAllUsers);

router.get("/get-user/:Id",authMiddleware.isAdmin, userController.getUser);

router.patch("/edit-user/:Id",authMiddleware.isAdmin, userController.editUser);

router.delete("/delete-user/:Id",authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
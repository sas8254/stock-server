const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.addUser);

router.get("/", userController.getAllUsers);

router.get("/:Id", userController.getUser);

router.patch("/:Id", userController.editUser);

router.delete("/:Id", userController.deleteUser);

module.exports = router;

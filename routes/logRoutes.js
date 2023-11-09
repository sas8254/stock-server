const express = require("express");
const logController = require("../controllers/logController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

//impliment authorization
router.post("/", authMiddleware.isAdmin, logController.addLog);

router.get("/", authMiddleware.isAdmin, logController.getAllLogs);

router.get("/:userId", authMiddleware.isUser, logController.getUserLogs);

module.exports = router;

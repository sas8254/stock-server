const express = require("express");
const logController = require("../controllers/LogController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware.isAdmin, logController.addLog);

router.get("/", authMiddleware.isAdmin, logController.getAllLogs);

// router.get("/:Id", authMiddleware.isAdmin, logController.getLogs);

module.exports = router;

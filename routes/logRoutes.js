const express = require("express");
const logController = require("../controllers/LogController");

const router = express.Router();

router.post("/", logController.addLog);

router.get("/", logController.getAllLogs);

router.get("/:userId", logController.getUserLogs);

module.exports = router;

const express = require("express");
const stockController = require("../controllers/stockController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware.isAdmin, stockController.addStock);

router.get("/", stockController.getAllStocks);

router.get("/:Id", authMiddleware.isAdmin, stockController.getStock);

router.patch("/:Id", authMiddleware.isAdmin, stockController.editStock);

router.delete("/:Id", authMiddleware.isAdmin, stockController.deleteStock);
// another route for get stock by name
module.exports = router;

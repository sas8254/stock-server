const express = require("express");
const stockController = require("../controllers/stockController");

const router = express.Router();

router.post("/", stockController.addStock);

router.get("/", stockController.getAllStocks);

router.get("/:Id", stockController.getStock);

router.patch("/:Id", stockController.editStock);

router.delete("/:Id", stockController.deleteStock);

module.exports = router;

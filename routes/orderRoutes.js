const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/place-order-NSE", orderController.placeLimtOrderNSE);
router.post("/place-order-MCX", orderController.placeLimtOrderMCX);
router.post("/place-order-NFO", orderController.placeLimtOrderNFO);
router.get("/get-positions/:id", orderController.getPositions);

module.exports = router;

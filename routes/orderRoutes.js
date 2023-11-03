const express = require("express");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/place-order-NSE", orderController.placeLimtOrderNSE);
router.post("/place-order-MCX", orderController.placeLimtOrderMCX);
router.post("/place-order-NFO", orderController.placeLimtOrderNFO);

module.exports = router;

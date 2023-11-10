const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post(
  "/place-order-NSE",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderNSE
);
router.post(
  "/place-order-MCX",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderMCX
);
router.post(
  "/place-order-NFO",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderNFO
);
router.get(
  "/get-positions/:id",
  authMiddleware.isAdmin,
  orderController.getPositions
);

module.exports = router;

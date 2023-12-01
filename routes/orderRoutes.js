const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get(
  "/get-latest-close",
  authMiddleware.isAdmin,
  orderController.getLatestClose
);
router.get(
  "/get-instruments",
  authMiddleware.isAdmin,
  orderController.getInstruments
);

router.get(
  "/get-positions/:id",
  authMiddleware.isUser,
  orderController.getPositionsAPI
);
router.get(
  "/get-orders/:id",
  authMiddleware.isUser,
  orderController.getOrdersAPI
);

router.post(
  "/place-order",
  authMiddleware.isAdmin,
  orderController.placeLimtOrder
);

router.post(
  "/place-order-for-all",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderForAll
);





module.exports = router;

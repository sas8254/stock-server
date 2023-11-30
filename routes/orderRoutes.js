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

router.post(
  "/place-order-NSE",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderNSE
);

// router.post(
//   "/place-order-NSE-all",
//   authMiddleware.isAdmin,
//   orderController.placeLimtOrderNSEForAll
// );

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
router.post(
  "/place-order-NFO-all",
  authMiddleware.isAdmin,
  orderController.placeLimtOrderNFOForAll
);




module.exports = router;

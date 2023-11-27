const orders = require("../utils/orderFunctions");
const apiCenter = require("../utils/apiCenter");
require("dotenv").config();
const Log = require("../models/logs");
const User = require("../models/user");
const axios = require("axios");

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

// exports.placeLimtOrderNSE = async (req, res) => {
//   try {
//     const {
//       tradingsymbol,
//       transaction_type,
//       exchange,
//       quantity,
//       price,
//       userId,
//     } = req.body;

//     const user = await User.findById(userId);
//     const api_key = user.brokerDetail.apiKey;
//     const access_token = user.brokerDetail.dailyAccessToken;

//     if (!access_token) {
//       return res.status(400).json("No access token found");
//     }

//     const orderId = await orders.limitOrderNSE(
//       tradingsymbol,
//       transaction_type,
//       exchange,
//       quantity,
//       price,
//       api_key,
//       access_token
//     );

//     if (!orderId) {
//       return res.status(400).json("Order Id not generated. Error in data.");
//     } else {
//       console.log("orderId is " + orderId);
//       const orderStatus = await apiCenter.orderCheckingHandler(
//         orderId,
//         api_key,
//         access_token
//       );
//       console.log(orderStatus);
//       const time = new Date();
//       const newLog = new Log({
//         orderId,
//         orderStatus,
//         tradingsymbol,
//         time,
//         price,
//         transaction_type,
//         userId,
//       });
//       res.status(200).json({ newLog });
//     }
//     await newLog.save();
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.placeLimtOrderNFO = async (stock, price, orderType) => {
  try {
    let userId = "6539eb4c7e2bbafb2d5ad569";

    const user = await User.findById(userId);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    if (!access_token) {
      return res.status(400).json("No access token found");
    }

    let tradingsymbol = stock.brokerDetail.tradingSymbol;
    let transaction_type = orderType;
    let exchange = "NFO";
    let quantity = 1;

    const orderId = await orders.limitOrderNFO(
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      api_key,
      access_token
    );

    if (!orderId) {
      console.log("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await apiCenter.orderCheckingHandler(
        orderId,
        api_key,
        access_token
      );
      console.log(orderStatus);
      const time = new Date();
      const newLog = new Log({
        orderId,
        orderStatus,
        tradingsymbol,
        time,
        price,
        transaction_type,
        userId,
      });
      await newLog.save();
      console.log(newLog);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.placeLimtOrderMCX = async (stock, price, orderType) => {
  try {
    let userId = "6539eb4c7e2bbafb2d5ad569";

    const user = await User.findById(userId);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    if (!access_token) {
      return res.status(400).json("No access token found");
    }

    let tradingsymbol = stock.brokerDetail.tradingSymbol;
    let transaction_type = orderType;
    let exchange = "MCX";
    let quantity = 1;

    const orderId = await orders.limitOrderMCX(
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      api_key,
      access_token
    );

    if (!orderId) {
      console.log("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await apiCenter.orderCheckingHandler(
        orderId,
        api_key,
        access_token
      );
      console.log(orderStatus);
      const time = new Date();
      const newLog = new Log({
        orderId,
        orderStatus,
        tradingsymbol,
        time,
        price,
        transaction_type,
        userId,
      });
      await newLog.save();
      console.log(newLog);
    }
  } catch (error) {
    console.log(error);
  }
};
//   const newInstance = instance();

//   try {
//     const user = await User.findById(req.params.id);
//     const api_key = user.brokerDetail.apiKey;
//     const access_token = user.brokerDetail.dailyAccessToken;

//     const response = await newInstance.get("/portfolio/positions", {
//       headers: {
//         "X-Kite-Version": process.env.KITE_VERSION,
//         Authorization: `token ${api_key}:${access_token}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     // console.log(response);
//     if (response) {
//       res.status(200).json({ response });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "An error occurred",
//       error,
//     });
//   }
// };

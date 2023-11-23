const orders = require("../utils/orderFunctions");
require("dotenv").config();
const Log = require("../models/logs");
const User = require("../models/user");
const Stock = require("../models/stock");
const axios = require("axios");
const { default: mongoose } = require("mongoose");

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

exports.placeLimtOrderNSE = async (req, res) => {
  try {
    const {
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    if (!access_token) {
      return res.status(400).json("No access token found");
    }

    const orderId = await orders.limitOrderNSE(
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      api_key,
      access_token
    );

    if (!orderId) {
      return res.status(400).json("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await orders.orderCheckingHandler(
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
      res.status(200).json({ newLog });
    }
    await newLog.save();
  } catch (error) {
    console.log(error);
  }
};

// exports.placeLimtOrderNSEForAll = async (req, res) => {
//   try {
//     const {
//       tradingsymbol,
//       transaction_type,
//       exchange,
//       // quantity,
//       price,
//       // userId,
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
//       const orderStatus = await orders.orderCheckingHandler(
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

exports.placeLimtOrderNFO = async (req, res) => {
  try {
    const {
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    if (!access_token) {
      return res.status(400).json("No access token found");
    }

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
      return res.status(400).json("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await orders.orderCheckingHandler(
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
      res.status(200).json({ newLog });
    }
    await newLog.save();
  } catch (error) {
    console.log(error);
  }
};

exports.placeLimtOrderNFOForAll = async (req, res) => {
  try {
    const { transaction_type, stockId, price } = req.body;
    const stock = await Stock.findById(stockId);
    const exchange = stock.brokerDetail.exchange;
    const tradingsymbol = stock.brokerDetail.tradingSymbol;

    const allUsers = await User.find({
      "stockDetail.stockId": stockId,
    }).lean();

    const users = allUsers.map((user) => {
      const specificStock = user.stockDetail.find((stock) => {
        return stock.stockId.toString() === stockId;
      });
      return { ...user, stockDetail: specificStock };
    });

    for (let user of users) {
      const foundUser = await User.findById(user._id);
      const api_key = foundUser.brokerDetail.apiKey;
      const access_token = foundUser.brokerDetail.dailyAccessToken;
      const quantity = foundUser.stockDetail[0].quantity;
      console.log(quantity);

      if (!access_token) {
        return res.status(400).json("No access token found");
      }

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
        return res.status(400).json("Order Id not generated. Error in data.");
      } else {
        console.log("orderId is " + orderId);
        const orderStatus = await orders.orderCheckingHandler(
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
          userId: foundUser._id,
        });
        res.status(200).json({ newLog });
      }
      await newLog.save();
    }
  } catch (error) {
    console.log(error);
  }
};

exports.placeLimtOrderMCX = async (req, res) => {
  try {
    const {
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    if (!access_token) {
      return res.status(400).json("No access token found");
    }

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
      return res.status(400).json("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await orders.orderCheckingHandler(
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
      res.status(200).json({ newLog });
    }
    await newLog.save();
  } catch (error) {
    console.log(error);
  }
};

exports.getPositions = async (req, res) => {
  const newInstance = instance();

  try {
    const user = await User.findById(req.params.id);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    const response = await newInstance.get("/portfolio/positions", {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response.data.data);
    if (response) {
      res.status(200).json({ response: JSON.stringify(response.data.data) });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

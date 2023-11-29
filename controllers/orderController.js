const apiCenter = require("../utils/apiCenter");
const orderFunctions = require("../utils/orderFunctions");
require("dotenv").config();
const Log = require("../models/logs");
const User = require("../models/user");
const Stock = require("../models/stock");

const getQuantity = async (tradingsymbol, api_key, access_token) => {
  const positions = await apiCenter.getPositions(api_key, access_token);
  for (let i = 0; positions.response.net.length; i++) {
    if (positions.response.net[i].tradingsymbol === tradingsymbol) {
      return positions.response.net[i].quantity;
    }
  }
  return 0;
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

    const orderId = await orderFunctions.limitOrderNSE(
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
      res.status(200).json({ newLog });
    }
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

//     const orderId = await orderFunctions.limitOrderNSE(
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
// await newLog.save();
//       res.status(200).json({ newLog });
//     }
//
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

    const orderId = await orderFunctions.limitOrderNFO(
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
      res.status(200).json({ newLog });
    }
  } catch (error) {
    console.log(error);
  }
};

// exports.placeLimtOrderNFOForAll = async (req, res) => {
//   try {
//     const { transaction_type, stockId, price } = req.body;
//     const stock = await Stock.findById(stockId);
//     const exchange = stock.brokerDetail.exchange;
//     const tradingsymbol = stock.brokerDetail.tradingSymbol;

//     const allUsers = await User.find({
//       stockDetail: {
//         $elemMatch: {
//           stockId: stockId,
//           isActive: true,
//         },
//       },
//     }).lean();

//     let responses = [];
//     let promises = [];

//     const users = allUsers.map((user) => {
//       const specificStock = user.stockDetail.find((stock) => {
//         return stock.stockId.toString() === stockId;
//       });
//       return { ...user, stockDetail: specificStock };
//     });

//     for (let user of users) {
//       promises.push(
//         new Promise(async (resolve, reject) => {
//           const foundUser = await User.findById(user._id);
//           const api_key = foundUser.brokerDetail.apiKey;
//           const access_token = foundUser.brokerDetail.dailyAccessToken;
//           const qty = foundUser.stockDetail[0].quantity;
//           const lotSize = stock.brokerDetail.lotSize;
//           const quantity = qty * lotSize;
//           console.log(quantity);
//           resolve();
//           return;

//           if (!access_token) {
//             responses.push({
//               userId: user._id,
//               error: "No access token found",
//             });
//             resolve();
//             return;
//           }

//           const orderId = await orderFunctions.limitOrderNFO(
//             tradingsymbol,
//             transaction_type,
//             exchange,
//             quantity,
//             price,
//             api_key,
//             access_token
//           );
//           if (!orderId) {
//             responses.push({
//               userId: user._id,
//               error: "Order Id not generated. Error in data.",
//             });
//           } else {
//             console.log("orderId is " + orderId);
//             const orderStatus = await apiCenter.orderCheckingHandler(
//               orderId,
//               api_key,
//               access_token
//             );
//             console.log(orderStatus);
//             const time = new Date();
//             const newLog = new Log({
//               orderId,
//               orderStatus,
//               tradingsymbol,
//               time,
//               price,
//               transaction_type,
//               userId: foundUser._id,
//             });
//             await newLog.save();
//             responses.push({ userId: user._id, newLog });
//           }
//           resolve();
//         })
//       );
//     }
//     await Promise.all(promises);
//     res.status(200).json(responses);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.toString() });
//   }
// };

exports.placeLimtOrderNFOForAll = async (req, res) => {
  try {
    const { transaction_type, stockId, price } = req.body;
    const stock = await Stock.findById(stockId);
    const exchange = stock.brokerDetail.exchange;
    const tradingsymbol = stock.brokerDetail.tradingSymbol;

    const allUsers = await User.find({
      stockDetail: {
        $elemMatch: {
          stockId: stockId,
          isActive: true,
        },
      },
    }).lean();

    const users = allUsers.map((user) => {
      const specificStock = user.stockDetail.find((stock) => {
        return stock.stockId.toString() === stockId;
      });
      return { ...user, stockDetail: specificStock };
    });

    // return res.send(users);

    let responses = [];
    let promises = [];

    for (let user of users) {
      const foundUser = await User.findById(user._id);
      const api_key = foundUser.brokerDetail.apiKey;
      const access_token = foundUser.brokerDetail.dailyAccessToken;
      const qty = foundUser.stockDetail[0].quantity;
      const lotSize = stock.brokerDetail.lotSize;
      let quantity = qty * lotSize;
      console.log(quantity);

      const oldQuantity = await getQuantity(
        tradingsymbol,
        api_key,
        access_token
      );
      console.log(oldQuantity, user.name, "****************************");
      resolve();
      return;

      if (!access_token) {
        responses.push({
          userId: user._id,
          error: "No access token found",
        });
        return;
      }

      const orderId = await orderFunctions.limitOrderNFO(
        tradingsymbol,
        transaction_type,
        exchange,
        quantity,
        price,
        api_key,
        access_token
      );
      if (!orderId) {
        responses.push({
          userId: user._id,
          error: "Order Id not generated. Error in data.",
        });
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
          userId: foundUser._id,
        });
        await newLog.save();
        if (orderStatus === "COMPLETE") {
          if (transaction_type === "BUY" && oldQuantity < 0) {
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await limitOrderNFO(
              tradingsymbol,
              transaction_type,
              exchange,
              quantity,
              price,
              api_key,
              access_token
            );
            if (!squareOffOrderId) {
              responses.push({
                userId: user._id,
                error: "squareOffOrderId Id not generated. Error in data.",
              });
            } else {
              console.log("squareOffOrderId" + squareOffOrderId);
              const squareOffOrderStatus = await apiCenter.orderCheckingHandler(
                squareOffOrderId,
                api_key,
                access_token
              );
              console.log(squareOffOrderStatus);
              const time = new Date();
              const newLog = new Log({
                squareOffOrderId,
                squareOffOrderStatus,
                tradingsymbol,
                time,
                price,
                transaction_type,
                userId: foundUser._id,
              });
              await newLog.save();
            }
          } else if (transaction_type === "SELL" && oldQuantity > 0) {
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await limitOrderNFO(
              tradingsymbol,
              transaction_type,
              exchange,
              quantity,
              price,
              api_key,
              access_token
            );
            if (!squareOffOrderId) {
              responses.push({
                userId: user._id,
                error: "squareOffOrderId Id not generated. Error in data.",
              });
            } else {
              console.log("squareOffOrderId" + squareOffOrderId);
              const squareOffOrderStatus = await apiCenter.orderCheckingHandler(
                squareOffOrderId,
                api_key,
                access_token
              );
              console.log(squareOffOrderStatus);
              const time = new Date();
              const newLog = new Log({
                squareOffOrderId,
                squareOffOrderStatus,
                tradingsymbol,
                time,
                price,
                transaction_type,
                userId: foundUser._id,
              });
              await newLog.save();
            }
          }
        }
        responses.push({
          userId: user._id,
          orderId,
          orderStatus,
        });
        promises.push(orderStatus, squareOffOrderStatus);
      }
    }
    await Promise.allSettled(promises);
    return responses;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
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

    const orderId = await orderFunctions.limitOrderMCX(
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
      res.status(200).json({ newLog });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getPositionsAPI = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;
    if (!api_key || !access_token) {
      return res.status(500).json({
        message: "api_key or accessToken is missing.",
      });
    }
    const response = await apiCenter.getPositions(api_key, access_token);
    if (response) {
      res.status(200).json({ response });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getLatestClose = async (req, res) => {
  try {
    const inst_token = req.query.inst_token;
    if (!inst_token) {
      return res.status(400).json("Inst_token reqired");
    }
    const price = await apiCenter.getLatestClose(inst_token);
    res.status(200).json({ price });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getInstruments = async (req, res) => {
  try {
    const instruments = await apiCenter.getInstruments();
    res.status(200).json(instruments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

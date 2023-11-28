const User = require("./models/User");
const Stock = require("./models/Stock");
const Log = require("./models/Log");

exports.handleStockTransaction = async (stockId, orderType) => {
  try {
    // Fetch the stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      throw new Error("Stock not found");
    }

    // Fetch all users who have this stock in their stockDetail
    const users = await User.find({ "stockDetail.stockId": stockId });

    // Array to keep track of promises
    let promises = [];

    for (let user of users) {
      // Get the user's stock detail for this stock
      const userStockDetail = user.stockDetail.find(
        (detail) => detail.stockId.toString() === stockId
      );

      // Calculate the quantity for the order
      const quantity = userStockDetail.quantity * stock.brokerDetail.lotSize;

      // Fetch the existing quantity of the stock in the user's broker account
      const oldQuantity = await getPositions(
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );

      // Place the order
      const orderId = await limitOrderNFO(
        stock.brokerDetail.tradingSymbol,
        orderType,
        stock.brokerDetail.exchange,
        quantity,
        stock.brokerDetail.price,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );

      // Check the order status
      const promise = orderCheckingHandler(
        orderId,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      ).then(async (isSuccessful) => {
        if (isSuccessful) {
          // Save the log
          const log = new Log({
            orderId,
            orderStatus: "COMPLETE",
            tradingsymbol: stock.brokerDetail.tradingSymbol,
            time: new Date(),
            price: stock.brokerDetail.price,
            transaction_type: orderType,
            userId: user._id,
          });
          await log.save();

          // Square off if necessary
          if (orderType === "BUY" && oldQuantity < 0) {
            await limitOrderNFO(
              stock.brokerDetail.tradingSymbol,
              "BUY",
              stock.brokerDetail.exchange,
              -oldQuantity,
              stock.brokerDetail.price,
              user.brokerDetail.apiKey,
              user.brokerDetail.dailyAccessToken
            );
          } else if (orderType === "SELL" && oldQuantity > 0) {
            await limitOrderNFO(
              stock.brokerDetail.tradingSymbol,
              "SELL",
              stock.brokerDetail.exchange,
              oldQuantity,
              stock.brokerDetail.price,
              user.brokerDetail.apiKey,
              user.brokerDetail.dailyAccessToken
            );
          }
        }

        // Return the response
        return {
          userId: user._id,
          orderId,
          isSuccessful,
        };
      });

      promises.push(promise);
    }

    // Wait for all promises to settle
    const responses = await Promise.allSettled(promises);

    // Return the responses
    return responses;
  } catch (error) {
    console.error(error);
  }
};

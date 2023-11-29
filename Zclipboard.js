const User = require("./models/User");
const Stock = require("./models/Stock");
const Log = require("./models/Log");

exports.handleStockTransaction = async (stockId, price, transactionType) => {
  try {
    // Fetch the stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      throw new Error("Stock not found");
    }

    // Fetch all users who have this stock in their stockDetail
    const users = await User.find({ "stockDetail.stockId": stockId });

    // Array to keep track of promises and responses
    let promises = [];
    let responses = [];

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
        transactionType,
        stock.brokerDetail.exchange,
        quantity,
        price,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );

      // Check the order status
      const promise = orderCheckingHandler(
        orderId,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      ).then(async (status) => {
        // Save the log
        const log = new Log({
          orderId,
          orderStatus: status,
          tradingsymbol: stock.brokerDetail.tradingSymbol,
          time: new Date(),
          price: price,
          transaction_type: transactionType,
          userId: user._id,
        });
        await log.save();

        // Square off if necessary
        if (status === "COMPLETE") {
          if (transactionType === "BUY" && oldQuantity < 0) {
            await limitOrderNFO(
              stock.brokerDetail.tradingSymbol,
              "BUY",
              stock.brokerDetail.exchange,
              -oldQuantity,
              price,
              user.brokerDetail.apiKey,
              user.brokerDetail.dailyAccessToken
            );
          } else if (transactionType === "SELL" && oldQuantity > 0) {
            await limitOrderNFO(
              stock.brokerDetail.tradingSymbol,
              "SELL",
              stock.brokerDetail.exchange,
              oldQuantity,
              price,
              user.brokerDetail.apiKey,
              user.brokerDetail.dailyAccessToken
            );
          }
        }

        // Push the response
        responses.push({
          userId: user._id,
          orderId,
          status,
        });
      });

      promises.push(promise);
    }

    // Wait for all promises to settle
    await Promise.allSettled(promises);

    // Return the responses
    return responses;
  } catch (error) {
    console.error(error);
  }
};

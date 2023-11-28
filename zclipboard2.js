const User = require("./models/User");
const Stock = require("./models/Stock");
const Log = require("./models/Log");

exports.handleOrders = async (stockId) => {
  try {
    // Fetch stock details
    const stock = await Stock.findById(stockId);
    if (!stock) {
      throw new Error("Stock not found");
    }

    // Fetch users who have the stock
    const users = await User.find({ "stockDetail.stockId": stockId });
    if (!users.length) {
      throw new Error("No users found with the given stock");
    }

    const promises = users.map(async (user) => {
      const userStockDetail = user.stockDetail.find(
        (detail) => detail.stockId.toString() === stockId
      );
      const quantity = userStockDetail.quantity * stock.brokerDetail.lotSize;

      // Fetch existing positions
      const positions = await getPositions(
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );
      const oldQuantity = positions.net[0].quantity;

      // Place the order
      const orderId = await limitOrderNFO(
        stock.brokerDetail.tradingSymbol,
        "BUY", // or 'SELL' depending on your logic
        stock.brokerDetail.exchange,
        quantity,
        stock.brokerDetail.price,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );

      // Check the order status
      const isOrderSuccessful = await orderCheckingHandler(
        orderId,
        user.brokerDetail.apiKey,
        user.brokerDetail.dailyAccessToken
      );

      // Prepare the response
      const response = { user: user._id, stock: stockId, isOrderSuccessful };

      // If order is successful, save the log
      if (isOrderSuccessful) {
        const log = new Log({
          orderId,
          orderStatus: "COMPLETE",
          tradingsymbol: stock.brokerDetail.tradingSymbol,
          time: new Date(),
          price: stock.brokerDetail.price,
          transaction_type: "BUY", // or 'SELL' depending on your logic
          userId: user._id,
        });
        await log.save();

        // Square off if necessary
        if (
          (oldQuantity < 0 && orderType === "BUY") ||
          (oldQuantity > 0 && orderType === "SELL")
        ) {
          const squareOffOrderId = await limitOrderNFO(
            stock.brokerDetail.tradingSymbol,
            oldQuantity < 0 ? "BUY" : "SELL",
            stock.brokerDetail.exchange,
            Math.abs(oldQuantity),
            stock.brokerDetail.price,
            user.brokerDetail.apiKey,
            user.brokerDetail.dailyAccessToken
          );
          const isSquareOffOrderSuccessful = await orderCheckingHandler(
            squareOffOrderId,
            user.brokerDetail.apiKey,
            user.brokerDetail.dailyAccessToken
          );
          if (isSquareOffOrderSuccessful) {
            const squareOffLog = new Log({
              orderId: squareOffOrderId,
              orderStatus: "COMPLETE",
              tradingsymbol: stock.brokerDetail.tradingSymbol,
              time: new Date(),
              price: stock.brokerDetail.price,
              transaction_type: oldQuantity < 0 ? "BUY" : "SELL",
              userId: user._id,
            });
            await squareOffLog.save();
          }
          response.isSquareOffOrderSuccessful = isSquareOffOrderSuccessful;
        }
      }

      return response;
    });

    const results = await Promise.allSettled(promises);
    return results;
  } catch (error) {
    console.error(error);
  }
};

//gpt 3.5
exports.placeLimtOrderNSEForAll = async (req, res) => {
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

    const responses = await Promise.all(
      users.map(async (user) => {
        const api_key = user.brokerDetail.apiKey;
        const access_token = user.brokerDetail.dailyAccessToken;
        const qty = user.stockDetail.quantity;
        const lotSize = stock.brokerDetail.lotSize;
        const quantity = qty * lotSize;

        if (!access_token) {
          return {
            userId: user._id,
            error: "No access token found",
          };
        }

        const oldQuantity = await getQuantity(
          tradingsymbol,
          api_key,
          access_token
        );

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
          return {
            userId: user._id,
            error: "Order Id not generated. Error in data.",
          };
        } else {
          const orderStatus = await apiCenter.orderCheckingHandler(
            orderId,
            api_key,
            access_token
          );

          const time = new Date();
          const newLog = new Log({
            orderId,
            orderStatus,
            tradingsymbol,
            time,
            price,
            transaction_type,
            userId: user._id,
          });

          await newLog.save();

          if (
            orderStatus === "COMPLETE" &&
            ((transaction_type === "BUY" && oldQuantity < 0) ||
              (transaction_type === "SELL" && oldQuantity > 0))
          ) {
            let squareOffQuantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrderNSE(
              tradingsymbol,
              transaction_type,
              exchange,
              squareOffQuantity,
              price,
              api_key,
              access_token
            );

            if (!squareOffOrderId) {
              return {
                userId: user._id,
                error: "squareOffOrderId Id not generated. Error in data.",
              };
            } else {
              const squareOffOrderStatus = await apiCenter.orderCheckingHandler(
                squareOffOrderId,
                api_key,
                access_token
              );

              const newLog = new Log({
                squareOffOrderId,
                squareOffOrderStatus,
                tradingsymbol,
                time,
                price,
                transaction_type,
                userId: user._id,
              });

              await newLog.save();
            }
          }

          return {
            userId: user._id,
            orderId,
            orderStatus,
          };
        }
      })
    );

    res.status(200).json({ responses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
};

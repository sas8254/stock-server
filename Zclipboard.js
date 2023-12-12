exports.placeLimtOrderForAll = async (req, res) => {
  // return res.send("hit");
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
    let squareOffPromises = [];

    promises = users.map(async (user) => {
      // return res.send(user);
      // const user = await User.findById(user._id);
      const api_key = user.brokerDetail.apiKey;
      const access_token = user.brokerDetail.dailyAccessToken;
      const qty = user.stockDetail.quantity;
      const lotSize = stock.brokerDetail.lotSize;
      let quantity = qty * lotSize;

      // return res.json({ api_key, access_token, qty, lotSize, quantity });
      const oldQuantity = await apiCenter.getQuantity(
        tradingsymbol,
        api_key,
        access_token
      );
      if (oldQuantity?.error) {
        responses.push({
          userId: user._id,
          name: user.name,
          error: oldQuantity.error,
        });
        return;
      }

      // return res.status(200).json(oldQuantity);

      const orderId = await orderFunctions.limitOrder(
        tradingsymbol,
        transaction_type,
        exchange,
        quantity,
        price,
        api_key,
        access_token
      );
      // console.log(orderId + user.name);
      if (orderId?.error) {
        responses.push({
          userId: user._id,
          name: user.name,
          error: "Order Id not generated. Error in data.",
        });
        return;
      }
      if (!orderId) {
        responses.push({
          userId: user._id,
          name: user.name,
          error: "Order Id not generated. Error in data.",
        });
        return;
      } else {
        console.log("orderId is - " + orderId + " - for user - " + user.name);
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
          userId: user._id,
          quantity,
        });
        await newLog.save();

        if (orderStatus === "COMPLETE" && exchange !== "NSE") {
          if (transaction_type === "BUY" && oldQuantity < 0) {
            // console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrder(
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
                name: user.name,
                error: "squareOffOrderId Id not generated. Error in data.",
              });
              return;
            } else {
              console.log("squareOffOrderId is - " + squareOffOrderId);
              const squareOffOrderStatus = await apiCenter.orderCheckingHandler(
                squareOffOrderId,
                api_key,
                access_token
              );
              console.log(squareOffOrderStatus);
              const time = new Date();
              const newLog = new Log({
                orderId: squareOffOrderId,
                orderStatus: squareOffOrderStatus,
                tradingsymbol,
                time,
                price,
                transaction_type,
                userId: user._id,
                quantity,
              });
              await newLog.save();
              responses.push({
                userId: user._id,
                name: user.name,
                squareOffOrderId,
                squareOffOrderStatus,
                quantity,
              });
              squareOffPromises.push(squareOffOrderStatus);
            }
          } else if (transaction_type === "SELL" && oldQuantity > 0) {
            // console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrder(
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
                name: user.name,
                error: "squareOffOrderId Id not generated. Error in data.",
              });
              return;
            } else {
              console.log("squareOffOrderId is - " + squareOffOrderId);
              const squareOffOrderStatus = await apiCenter.orderCheckingHandler(
                squareOffOrderId,
                api_key,
                access_token
              );
              console.log(squareOffOrderStatus);
              const time = new Date();
              const newLog = new Log({
                orderId: squareOffOrderId,
                orderStatus: squareOffOrderStatus,
                tradingsymbol,
                time,
                price,
                transaction_type,
                userId: user._id,
                quantity,
              });
              await newLog.save();
              responses.push({
                userId: user._id,
                name: user.name,
                squareOffOrderId,
                squareOffOrderStatus,
                quantity,
              });
              squareOffPromises.push(squareOffOrderStatus);
            }
          }
        }
        responses.push({
          userId: user._id,
          name: user.name,
          orderId,
          orderStatus,
          quantity,
        });
        return orderStatus;
      }
    });

    await Promise.allSettled(promises);
    await Promise.allSettled(squareOffPromises);
    // console.log(promises);
    res.status(200).json({ responses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
};

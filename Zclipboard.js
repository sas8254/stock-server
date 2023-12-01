exports.placeLimtOrderNSEForAllParalle = async (req, res) => {
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

    promises = users.map(async (user) => {
      // return res.send(user);
      // const user = await User.findById(user._id);
      const api_key = user.brokerDetail.apiKey;
      const access_token = user.brokerDetail.dailyAccessToken;
      const qty = user.stockDetail.quantity;
      const lotSize = stock.brokerDetail.lotSize;
      let quantity = qty * lotSize;

      // return res.json({ api_key, access_token, qty, lotSize, quantity });
      const oldQuantity = await getQuantity(
        tradingsymbol,
        api_key,
        access_token
      );
      // console.log(oldQuantity, user.name, "****************************");
      // return res.status(200).json(oldQuantity);

      if (!access_token) {
        responses.push({
          userId: user._id,
          error: "No access token found",
        });
        return;
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
        responses.push({
          userId: user._id,
          error: "Order Id not generated. Error in data.",
        });
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
        });
        await newLog.save();

        if (orderStatus === "COMPLETE") {
          if (transaction_type === "BUY" && oldQuantity < 0) {
            console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrderNSE(
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
              console.log("squareOffOrderId is - " + squareOffOrderId);
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
                userId: user._id,
              });
              await newLog.save();
              promises.push(squareOffOrderStatus);
            }
          } else if (transaction_type === "SELL" && oldQuantity > 0) {
            console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrderNSE(
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
              console.log("squareOffOrderId is - " + squareOffOrderId);
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
                userId: user._id,
              });
              await newLog.save();
              promises.push(squareOffOrderStatus);
            }
          }
        }
        responses.push({
          userId: user._id,
          orderId,
          orderStatus,
        });
        return orderStatus;
      }
    });

    await Promise.allSettled(promises);
    res.status(200).json({ responses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
};

exports.placeLimtOrderNSEForAllParallev2 = async (req, res) => {
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
      const oldQuantity = await getQuantity(
        tradingsymbol,
        api_key,
        access_token
      );
      // console.log(oldQuantity, user.name, "****************************");
      // return res.status(200).json(oldQuantity);

      if (!access_token) {
        responses.push({
          userId: user._id,
          error: "No access token found",
        });
        return;
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
        responses.push({
          userId: user._id,
          error: "Order Id not generated. Error in data.",
        });
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
        });
        await newLog.save();

        if (orderStatus === "COMPLETE") {
          if (transaction_type === "BUY" && oldQuantity < 0) {
            console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrderNSE(
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
              console.log("squareOffOrderId is - " + squareOffOrderId);
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
                userId: user._id,
              });
              await newLog.save();
              squareOffPromises.push(squareOffOrderStatus);
            }
          } else if (transaction_type === "SELL" && oldQuantity > 0) {
            console.log("this should not run ******************");
            let quantity = Math.abs(oldQuantity);
            const squareOffOrderId = await orderFunctions.limitOrderNSE(
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
              console.log("squareOffOrderId is - " + squareOffOrderId);
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
                userId: user._id,
              });
              await newLog.save();
              squareOffPromises.push(squareOffOrderStatus);
            }
          }
        }
        responses.push({
          userId: user._id,
          orderId,
          orderStatus,
        });
        return orderStatus;
      }
    });

    await Promise.allSettled(promises);
    await Promise.allSettled(squareOffPromises);
    res.status(200).json({ responses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
};

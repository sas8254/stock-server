exports.placeLimtOrderNSE = async (req, res) => {
  try {
    console.log(req.body);
    const {
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      userId,
    } = req.body;
    const user = await User.findById(userId);
    // return console.log(user)
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;
    // console.log(user)
    if (!access_token) {
      return res.status(403).json("No access token fond");
    }
    const orderId = await limitOrderNSE(
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      api_key,
      access_token
    );

    const time = new Date();

    if (!orderId) {
      return res.status(403).json("Order Id not generated. Error in data.");
    } else {
      console.log("orderId is " + orderId);
      const orderStatus = await orderCheckingHandler(
        orderId,
        api_key,
        access_token
      );
      console.log(orderStatus);
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

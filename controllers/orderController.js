require("dotenv").config();
const Log = require("../models/logs");
const User = require("../models/user");
const axios = require("axios");

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

const limitOrderNSE = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  api_key,
  access_token
) => {
  try {
    const newInstance = instance();
    const response = await newInstance.post(
      "/orders/regular",
      {
        exchange,
        tradingsymbol,
        transaction_type,
        quantity,
        order_type: "LIMIT",
        product: "CNC",
        validity: "TTL",
        price,
        validity_ttl: 1,
      },
      {
        headers: {
          "X-Kite-Version": process.env.KITE_VERSION,
          Authorization: `token ${api_key}:${access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response) {
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);
  }
};

const limitOrderNFO = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  api_key,
  access_token
) => {
  try {
    const newInstance = instance();
    const response = await newInstance.post(
      "/orders/regular",
      {
        exchange,
        tradingsymbol,
        transaction_type,
        quantity,
        order_type: "LIMIT",
        product: "NRML",
        validity: "TTL",
        price,
        validity_ttl: 1,
      },
      {
        headers: {
          "X-Kite-Version": process.env.KITE_VERSION,
          Authorization: `token ${api_key}:${access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response) {
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);
  }
};

const limitOrderMCX = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  api_key,
  access_token
) => {
  try {
    const newInstance = instance();
    const response = await newInstance.post(
      "/orders/regular",
      {
        exchange,
        tradingsymbol,
        transaction_type,
        quantity,
        order_type: "LIMIT",
        product: "NRML",
        validity: "DAY",
        price,
      },
      {
        headers: {
          "X-Kite-Version": process.env.KITE_VERSION,
          Authorization: `token ${api_key}:${access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response) {
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);
  }
};

const orderHistoryThroughApi = async (api_key, access_token, id) => {
  const newInstance = instance();

  try {
    // console.log(access_token);

    const response = await newInstance.get(`/orders/${id}`, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(response);
    if (response) {
      return response.data.data;
    }
  } catch (error) {
    // console.log(error)
  }
};

function orderCheckingHandler(order_id, api_key, access_token) {
  return new Promise((resolve, reject) => {
    const orderChecking = setInterval(() => {
      orderHistoryThroughApi(api_key, access_token, order_id)
        .then((res) => {
          // console.log(res)
          console.log(res.slice(-1)[0].status + "line no 94");
          if (res.slice(-1)[0].status === "COMPLETE") {
            resolve(true);
            clearInterval(orderChecking);
          } else if (
            res.slice(-1)[0].status === "CANCELLED" ||
            res.slice(-1)[0].status === "REJECTED"
          ) {
            resolve(false);
            clearInterval(orderChecking);
          }
        })
        .catch((err) => {});

      console.log("checking");
    }, 5000);

    setTimeout(() => {
      clearInterval(orderChecking);
      resolve(false);
    }, 62000);
  });
}

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

    const orderId = await limitOrderNSE(
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
      const orderStatus = await orderCheckingHandler(
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

    const orderId = await limitOrderNFO(
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
      const orderStatus = await orderCheckingHandler(
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

    const orderId = await limitOrderMCX(
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
      const orderStatus = await orderCheckingHandler(
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
    // console.log(response);
    if (response) {
      res.status(200).json({ response });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

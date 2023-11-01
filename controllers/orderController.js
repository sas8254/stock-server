require("dotenv").config();
const Log = require("../models/logs");
const User = require("../models/user");
const axios = require("axios");

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

const placeOrderInnerFunc = async (api_key, access_token, data) => {
  const newInstance = instance();
  // console.log(data);
  try {
    // console.log(access_token);

    const response = await newInstance.post("/orders/regular", data, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(response);
    if (response) {
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    // console.log(error);
  }
};

const placeLimitOrderByApi = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  api_key,
  access_token,
  userId
) => {
  // console.log("placing limit order by api");
  // console.log(transaction_type);
  try {
    const response = await placeOrderInnerFunc(api_key, access_token, {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: transaction_type,
      quantity: quantity,
      order_type: "LIMIT",
      product: "CNC",
      validity: "TTL",
      price: price,
      validity_ttl: 1,
    });
    if (response) {
      return response; //(response or response.orderid need to be checked )
    }
  } catch (error) {
    // console.log("error in placing limit order ");
    // console.log(error);
  }
};

const orderHistoryThroughApi = async (api_key, access_token, id) => {
  const newInstance = instance();

  try {
    // console.log(access_token);

    const j = await newInstance.get(`/orders/${id}`, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    // console.log(j);
    if (j) {
      return j.data.data;
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

exports.placeLimtOrder = async (req, res) => {
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
    // const api_key = "m9vw48uef04xtbzw";
    // const access_token = "2I0M6gC7wbSePOkKlBCzcAc1Nr4z9vhp";

    const orderId = await placeLimitOrderByApi(
      tradingsymbol,
      transaction_type,
      exchange,
      quantity,
      price,
      api_key,
      access_token
    );
    if (!orderId) {
      return res.json("Order Id not generated. Error in data.");
    }
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
      tradingSymbol: tradingsymbol,
      time,
      price,
      tradingType: transaction_type,
      userId,
    });

    const log = await newLog.save();
  } catch (error) {
    // console.log(error);
  }
};

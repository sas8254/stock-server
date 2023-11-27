const axios = require("axios");
require("dotenv").config();

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

exports.limitOrderNSE = async (
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

exports.limitOrderNFO = async (
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

exports.limitOrderMCX = async (
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



const axios = require("axios");
require("dotenv").config();

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

exports.limitOrder = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  api_key,
  access_token
) => {
  try {
    let dataOject = {
      exchange,
      tradingsymbol,
      transaction_type,
      quantity,
      order_type: "LIMIT",
      exchange,
      price,
    };
    if (exchange === "NSE") {
      dataOject["product"] = "CNC";
      dataOject["validity"] = "TTL";
      dataOject["validity_ttl"] = 1;
    } else if (exchange === "NFO") {
      dataOject["product"] = "NRML";
      dataOject["validity"] = "TTL";
      dataOject["validity_ttl"] = 1;
    } else if (exchange === "MCX") {
      dataOject["product"] = "NRML";
      dataOject["validity"] = "DAY";
    } else {
      console.log("Exchange error, value for exchange is " + exchange);
      return "exchange error! chech exchange value";
    }
    // console.log(dataOject);
    const newInstance = instance();
    const response = await newInstance.post("/orders/regular", dataOject, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response) {
      // console.log(response.data + "*******************************");
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);
    return { error: "An error occurred while placing order" };
  }
};

exports.updateOrder = async (api_key, access_token, price, orderId) => {
  try {
    const newInstance = instance();
    const response = await newInstance.put(
      `/orders/regular/${orderId}`,
      {
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
      console.log(response.data);
      return response.data || "error while updating order";
    }
  } catch (error) {
    console.log("error in updating order");
    console.log(error);
    return { error: "An error occurred while updating order" };
  }
};

exports.deleteOrder = async (api_key, access_token, orderId) => {
  try {
    const newInstance = instance();
    const response = await newInstance.delete(`/orders/regular/${orderId}`, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response) {
      console.log(response.data);
      return response.data || "error in deliting order";
    }
  } catch (error) {
    console.log("error in deliting order");
    console.log(error);
    return { error: "An error occurred while deleting order" };
  }
};

exports.getOrders = async (api_key, access_token) => {
  try {
    const newInstance = instance();
    const response = await newInstance.get("/orders", {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response) {
      return response.data || "error in fetching order data";
    }
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while getting orders" };
  }
};

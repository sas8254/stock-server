require("dotenv").config();

const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

const placeOrderInnerFunc = async (api_key, access_token, data) => {
  const newInstance = instance();
  console.log(data);
  try {
    console.log(access_token);

    const response = await newInstance.post("/orders/regular", data, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response);
    if (response) {
      return response.data.data.order_id || "invalid order data";
    }
  } catch (error) {
    console.log(error);
  }
};

const placeLimitOrderByApi = async (
  tradingsymbol,
  transaction_type,
  exchange,
  quantity,
  price,
  userId
) => {
  console.log("placing limit order by api");
  console.log(transaction_type);
  try {
    const response = await placeOrderInnerFunc(api_key, access_token, {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: transaction_type,
      quantity: quantity,
      order_type: "LIMIT",
      product: "NRML",
      validity: "TTL",
      price: price,
      validity_ttl: 1,
    });
    if (response) {
      return response; //(response or response.orderid need to be checked )
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);
  }
};

function orderCheckingHandler(order_id) {
  return new Promise((resolve, reject) => {
    const orderChecking = setInterval(() => {
      apiCenter
        .orderHistoryThroughApi(api_key, access_token, order_id)
        .then((res) => {
          // console.log(res)
          console.log(res.slice(-1)[0].status);
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
      resolve(true);
    }, 62000);
  });
}

const orderHistoryThroughApi = async (api_key, access_token, id) => {
  const newInstance = instance();

  try {
    console.log(access_token);

    const j = await newInstance.get("/orders/id", {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(j);
    if (j) {
      return j.data.data;
    }
  } catch (error) {
    // console.log(error)
  }
};

const limitOrderTester = async () => {
  try {
    const orderId = await placeLimitOrderByApi(
      "CRUDEOILM23NOVFUT",
      "BUY",
      "MCX",
      1,
      6615
    );
    console.log(orderId + "line 185");
    const orderStatus = await orderCheckingHandler(orderId);
    console.log(orderStatus);
  } catch (error) {
    console.log(error);
  }
};

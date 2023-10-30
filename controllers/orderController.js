const instance = () => {
  return axios.create({
    baseURL: `${process.env.KITE_URL}`,
  });
};

const placeOrderThroughApi = async (api_key, access_token, data) => {
  const newInstance = this.instance();
  console.log(data);
  try {
    console.log(access_token);

    const j = await newInstance.post("/orders/regular", data, {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(j);
    if (j) {
      return j;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.placeLimitOrderByApi = async (
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
    const j = await apiCenter.placeOrderThroughApi(api_key, access_token, {
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
    if (j) {
      return j; //(j or j.orderid need to be checked )
    }
  } catch (error) {
    console.log("error in placing limit order ");
    console.log(error);

    whatsapp.sendMsg(error);
    mailer.sendMail(error);
  }
};

const mailer = require("../communication/mailer");

const placeOrderHandler = async (transaction_type) => {
  try {
    const placeOrder = await kiteConnection.placeOrder(
      tradingsymbol,
      transaction_type,
      "MCX",
      1
    );
    console.log("order_placed");
    console.log(placeOrder.order_id);
    mailer.sendMail("order_placed and order id ->" + placeOrder.order_id);
  } catch (error) {
    console.log(error);
  }
};

module.exports.jadejaOrderHandler = async (ary, stockDetail) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await kiteConnection.getMinutesMain(inst_token);
    const latest_close = minutesData.slice(-1)[0][4];

    let file_order_type; //fetch and replace with buy or sell

    let orderplaced = false;
    const lastGreenCandle = ary[ary.findLastIndex((e) => e[4] === "green")];
    console.log(trading_symbol + lastGreenCandle);
    const lastRedCandle = ary[ary.findLastIndex((e) => e[4] === "red")];
    console.log(trading_symbol + lastRedCandle);
    if (
      file_order_type === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;
      //place SELL order for 1 user
      //update stock staus to sell

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${trading_symbol} placed at ${latest_close} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      file_order_type === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");
      orderplaced = true;
      //place buy order for 1 user
      //update stock staus to buy

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${trading_symbol} placed at ${latest_close} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${trading_symbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
    console.log("at this stage");
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

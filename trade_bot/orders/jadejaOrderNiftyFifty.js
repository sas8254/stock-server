const dbConnect = require("../Database/dbConnect");
const mailer = require("../communication/mailer");
const kiteConnection = require("../kiteConnection/kiteConnection");
const tradingsymbol = "CRUDEOILM23SEPFUT";
const orderFilePath = "orderFile\\nifty.json";
const fs = require("fs");

const orderReader = async () => {
  // console.log("order reader run")
  return await fs.promises.readFile(
    orderFilePath,
    "utf8",
    (err, jsonString) => {
      if (err) {
        //   console.log("File read failed:", err);
        return;
      }
      // console.log("File data:", JSON.parse(jsonString) );
      return jsonString;
    }
  );
};

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

module.exports.jadejaOrderHandler = async (
  ary,
  inst_token,
  trading_symbol,
  exchange,
  lot_size
) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await kiteConnection.getMinutesMain(inst_token);
    const latest_close = minutesData.slice(-1)[0][4];
    // console.log(latest_close)
    // console.log(lastTwoAry)
    let file_order_type;
    const file_read = await orderReader();
    file_order_type = JSON.parse(file_read).transaction;
    // console.log("order jadeja handler run")
    // console.log(file_order_type)
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
      let data = JSON.stringify({ transaction: "SELL" });
      fs.writeFileSync(orderFilePath, data);
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
      let data = JSON.stringify({ transaction: "BUY" });
      fs.writeFileSync(orderFilePath, data);
      mailer.sendMailToJadeja(
        `Alert: BUY order of ${trading_symbol} placed at ${latest_close} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    const positions = await kiteConnection.getPositions();
    const filteredPositions = positions.filter(
      (e) => e.tradingsymbol === tradingsymbol
    );
    // console.log(filteredPositions)
    // if (filteredPositions.length > 0) {
    //const positionQuantity = filteredPositions[0].quantity

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

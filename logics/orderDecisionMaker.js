const mailer = require("../utils/mailer")
const orderHandler = require("../utils/orderHandler")
const Stock = require("../models/stock")
const apiCenter = require("../utils/apiCenter")

module.exports.crudeOilMiniOrderHandler = async (ary, stock) => {
  try {
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;

    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");

    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderMCX(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");
      orderplaced = true;
      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderMCX(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

module.exports.crudeOilOrderHandler = async (ary, stock) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;
    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");
    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderMCX(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");
      orderplaced = true;
      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderMCX(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

module.exports.oneHourlyNiftyFiftyOrderHandler = async (ary, stock) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;
    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");
    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");
      orderplaced = true;
      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

module.exports.oneHourlyBankNiftyFiftyOrderHandler = async (ary, stock) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;
    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");
    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");

      orderplaced = true;

      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

module.exports.lastFiveMinuteBankNiftyFiftyOrderHandler = async (
  ary,
  stock
) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;
    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");
    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");

      orderplaced = true;

      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

module.exports.lastFiveMinuteNiftyFiftyOrderHandler = async (ary, stock) => {
  try {
    // console.log(ary)
    const arrivedAry = ary.length > 0 && [...ary.slice(-2)];
    const lastTwoAry = [...arrivedAry];
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );
    const price = minutesData.slice(-1)[0][4];

    let orderType = stock.status;

    let orderplaced = false;
    const lastGreenCandle = ary.reverse().find((e) => e[4] === "green");
    const lastRedCandle = ary.reverse().find((e) => e[4] === "red");
    if (
      orderType === "BUY" &&
      lastTwoAry[1][4] === "red" &&
      lastGreenCandle[2] > lastTwoAry[1][3]
    ) {
      orderplaced = true;

      orderType = "SELL";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      console.log("sell order placed");
      mailer.sendMailToJadeja(
        `Alert: SELL order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    } else if (
      orderType === "SELL" &&
      lastTwoAry[1][4] === "green" &&
      lastRedCandle[1] < lastTwoAry[1][3]
    ) {
      console.log("buy order placed");

      orderplaced = true;

      orderType = "BUY";

      const result = await Stock.updateOne(
        { _id: stock._id },
        { $set: { status: orderType } }
      );
      if (result.nModified > 0) {
        console.log(`Stock status updated successfully`);
      } else {
        console.log(`Stock not found or status is already set to ${orderType}`);
      }

      // await orderHandler.placeLimtOrderNFO(stock, price, orderType);

      mailer.sendMailToJadeja(
        `Alert: BUY order of ${stock.brokerDetail.tradingSymbol} placed at ${price} ,last heikin data is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }

    if (!orderplaced) {
      console.log("order not placed");
      mailer.sendMail(
        `last heikin data of ${stock.brokerDetail.tradingSymbol} is open : ${lastTwoAry[1][0]},high : ${lastTwoAry[1][1]},low : ${lastTwoAry[1][2]},close : ${lastTwoAry[1][3]}, flag:${lastTwoAry[1][4]}`
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error tripped");
  }
};

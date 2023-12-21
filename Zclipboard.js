const apiCenter = require("../utils/apiCenter");
const orderDecisionMaker = require("./orderDecisionMaker");

const minutesToHour = (arry) => {
  let lastMinutesCandles;
  if (
    +arry.slice(-1)[0][0].split("T")[1].split(":")[1] ===
    new Date().getMinutes()
  ) {
    arry.pop();
  }

  lastMinutesCandles = [...arry.slice(-60)];

  // console.log(lastCandleNineToEleven)
  const highAry = lastMinutesCandles.map((e) => e[2]);
  const lowAry = lastMinutesCandles.map((e) => e[3]);
  const open = lastMinutesCandles[0][1];
  const high = Math.max(...highAry);
  const low = Math.min(...lowAry);
  const close = lastMinutesCandles[lastMinutesCandles.length - 1][4];
  return [open, high, low, close];
};

const minutesToTenMinute = (arry) => {
  let lastMinutesCandles;
  if (
    +arry.slice(-1)[0][0].split("T")[1].split(":")[1] ===
    new Date().getMinutes()
  ) {
    arry.pop();
  }

  lastMinutesCandles = [...arry.slice(-10)];

  // console.log(lastCandleNineToEleven)
  const highAry = lastMinutesCandles.map((e) => e[2]);
  const lowAry = lastMinutesCandles.map((e) => e[3]);
  const open = lastMinutesCandles[0][1];
  const high = Math.max(...highAry);
  const low = Math.min(...lowAry);
  const close = lastMinutesCandles[lastMinutesCandles.length - 1][4];
  return [open, high, low, close];
};

const heikinConverter = (arry) => {
  const arrivedAry = [...arry];
  const dP = (num) => {
    return Number(Math.round(num + "e" + 2) + "e-" + 2).toFixed(2);
  };
  // console.log(JSON.stringify(arrivedAry))
  const firstHeikinAry = [];
  const processedData = arrivedAry.map((e, index) => {
    let close, high, open, low, flag;
    if (index === 0) {
      close = (e[0] + e[1] + e[2] + e[3]) / 4;
      open = e[0];
      high = e[1];
      low = e[2];
    } else {
      close = (e[0] + e[1] + e[2] + e[3]) / 4;
      open = (firstHeikinAry[index - 1][0] + firstHeikinAry[index - 1][3]) / 2;
      high = Math.max(e[1], open, close);
      low = Math.min(e[2], open, close);
    }

    flag = close > open ? "green" : "red";
    //   console.log([+dP(open), +dP(high), +dP(low), +dP(close), flag])
    firstHeikinAry.push([+dP(open), +dP(high), +dP(low), +dP(close), flag]);
  });
  //    console.log(firstHeikinAry)
  return firstHeikinAry;
};

module.exports.oneHourlyCrudeOilMiniDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getHoursMain(
      stock.brokerDetail.instrumentToken
    );
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );

    const rowCandles = [...hourlyRowCandles];
    // console.log(rowCandles)

    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours() - 1
    ) {
      rowCandles.pop();
    }

    const lastHourCandle = minutesToHour(minutesData);

    // console.log(lastHourCandle)

    const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]]);
    // console.log(JSON.stringify([...arry, lastHourCandle]))

    const heikincandleData = heikinConverter([...arry, lastHourCandle]);
    //   console.log(heikincandleData)
    // console.log(JSON.stringify(heikincandleData));
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

module.exports.fourHourlyCrudeOilMiniDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getCandleData(
      stock.brokerDetail.instrumentToken,
      "2hour"
    );
    const minutesData = await apiCenter.getCandleData(
      stock.brokerDetail.instrumentToken,
      "minute"
    );

    const rowCandles = [...hourlyRowCandles];
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
        new Date().getHours() - 2 &&
      new Date().getHours() !== 23
    ) {
      rowCandles.pop();
    }

    const lastTwoHourCandle = minutesToHour(minutesData);

    lastTwoHourCandle.unshift("date");
    console.log(lastTwoHourCandle);
    const heikincandleData = heikinConverter([
      ...twoHourToFourConverter([...rowCandles, lastTwoHourCandle]),
    ]);
    // console.log(heikincandleData)
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

module.exports.oneHourlyNiftyFiftyDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getHoursMain(
      stock.brokerDetail.instrumentToken
    );
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );

    const rowCandles = [...hourlyRowCandles];
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours() - 1
    ) {
      rowCandles.pop();
    }

    const lastHourCandle = minutesToHour(minutesData);

    // console.log(lastHourCandle)
    const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]]);
    const heikincandleData = heikinConverter([...arry, lastHourCandle]);
    // console.log(JSON.stringify(heikincandleData))
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

module.exports.oneHourlyBankNiftyDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getHoursMain(
      stock.brokerDetail.instrumentToken
    );
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );

    const rowCandles = [...hourlyRowCandles];
    // console.log(rowCandles)
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours() - 1
    ) {
      rowCandles.pop();
    }

    const lastHourCandle = minutesToHour(minutesData);

    // console.log(lastHourCandle)
    const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]]);
    const heikincandleData = heikinConverter([...arry, lastHourCandle]);
    // console.log(JSON.stringify(heikincandleData))
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

module.exports.lastFiveMinuteBankNiftyDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getHoursMain(
      stock.brokerDetail.instrumentToken
    );
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );

    const rowCandles = [...hourlyRowCandles];
    // console.log(rowCandles)
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    // console.log(rowCandles)
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours() - 1
    ) {
      rowCandles.pop();
    }
    // console.log(rowCandles)
    const lastTenMinuteCandle = minutesToTenMinute(minutesData);

    console.log(lastTenMinuteCandle);
    const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]]);

    const heikincandleData = heikinConverter([...arry, lastTenMinuteCandle]);
    // console.log(JSON.stringify(heikincandleData))
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

module.exports.lastFiveMinuteNiftyDesicionMaker = async (stock) => {
  try {
    const hourlyRowCandles = await apiCenter.getHoursMain(
      stock.brokerDetail.instrumentToken
    );
    const minutesData = await apiCenter.getMinutesMain(
      stock.brokerDetail.instrumentToken
    );

    const rowCandles = [...hourlyRowCandles];
    // console.log(rowCandles)
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours()
    ) {
      rowCandles.pop();
    }
    // console.log(rowCandles)
    if (
      +rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] ===
      new Date().getHours() - 1
    ) {
      rowCandles.pop();
    }
    // console.log(rowCandles)
    const lastTenMinuteCandle = minutesToTenMinute(minutesData);

    console.log(lastTenMinuteCandle);
    const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]]);

    const heikincandleData = heikinConverter([...arry, lastTenMinuteCandle]);
    // console.log(JSON.stringify(heikincandleData))
    orderDecisionMaker.orderHandler(heikincandleData, stock);
  } catch (error) {
    console.log(error);
  }
};

const cron = require("node-cron");
const tradeLogic = require("../logics/tradeLogic");
const Stock = require("../models/stock");

module.exports.scheduleCrudeOilMini = async () => {
  try {
    const stock = await Stock.findOne({ name: "crudeOilMini" });
    if (stock.isActiveFromAdmin) {
      cron.schedule(
        "0 10-23 * * 1,2,3,4,5",
        () => {
          tradeLogic.oneHourlyCrudeOilMiniDesicionMaker(stock);
          console.log("run through trade cron");
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.scheduleBankNifty = async () => {
  try {
    const stock = await Stock.findOne({ name: "bankNifty" });
    if (stock.isActiveFromAdmin) {
      cron.schedule(
        "15 10-15 * * 1,2,3,4,5",
        () => {
          tradeLogic.oneHourlyBankNiftyDesicionMaker(stock);
          console.log("run through trade cron");
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
      cron.schedule(
        "25 10- 15 * * 1,2,3,4,5",
        () => {
          tradeLogic.lastFiveMinuteBankNiftyDesicionMaker(stock);
          console.log("run through trade cron");
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.scheduleNiftyFifty = async () => {
  try {
    const stock = await Stock.findOne({ name: "niftyFifty" });
    if (stock.isActiveFromAdmin) {
      cron.schedule(
        "17 10-15 * * 1,2,3,4,5",
        () => {
          tradeLogic.oneHourlyNiftyDesicionMaker(stock);
          console.log("run through trade cron");
        },
        {
          scheduled: true,
          timezone: "Asia/Kolkata",
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

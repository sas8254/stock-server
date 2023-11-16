const cron = require("node-cron");
const tradeLogicStage1 = require("../logics/tradeLogicStage1");
const Stock = require("../models/stock");

module.exports.scheduleCrudeOilMini = async () => {
  try {
    const stock = await Stock.findOne({ name: "crudeOilMini" });
    if (stock.isActiveFromAdmin) {
      cron.schedule(
        "0 10-23 * * 1,2,3,4,5",
        () => {
          tradeLogicStage1.oneHourlyCrudeOilMiniDesicionMaker(stock);
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
          tradeLogicStage1.oneHourlyBankNiftyDesicionMaker(stock);
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
          tradeLogicStage1.lastFiveMinuteBankNiftyDesicionMaker(stock);
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
          tradeLogicStage1.oneHourlyNiftyFiftyDesicionMaker(stock);
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

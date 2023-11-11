const cron = require("node-cron");
const tradeLogic = require("../logics/trade");

module.exports.scheduleCrudeOilMini = () => {
  cron.schedule(
    "0 10-23 * * 1,2,3,4,5",
    () => {
      //fetch sotck crude oil m, get all the data.
      tradeLogic
        .oneHourlyCrudeOilMiniDesicionMaker
        // "65859335",
        // "CRUDEOILM23NOVFUT",
        // "MCX",
        // 1
        //replace above 4 lines with stock detail
        ();
      console.log("run through trade cron");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports.scheduleBankNifty = () => {
  cron.schedule(
    "15 10-15 * * 1,2,3,4,5",
    () => {
      tradeLogic.oneHourlyBankNiftyDesicionMaker(
        "14827266",
        "BANKNIFTY23NOVFUT",
        "NFO",
        15
      );
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
      tradeLogic.lastFiveMinuteBankNiftyDesicionMaker(
        "8979970",
        "BANKNIFTY23OCTFUT",
        "NFO",
        15
      );
      console.log("run through trade cron");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports.scheduleNiftyFifty = () => {
  cron.schedule(
    "17 10-15 * * 1,2,3,4,5",
    () => {
      tradeLogic.oneHourlyNiftyDesicionMaker(
        "8980226",
        "NIFTY23OCTFUT",
        "NFO",
        50
      );
      console.log("run through trade cron");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

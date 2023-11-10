const cron = require("node-cron");
const jadejaLogic = require("../logics/jadeja");

module.exports.scheduleCrudeOilMini = () => {
  cron.schedule(
    "0 10-23 * * 1,2,3,4,5",
    () => {
      jadejaLogic.oneHourlyCrudeOilMiniDesicionMaker(
        "65859335",
        "CRUDEOILM23NOVFUT",
        "MCX",
        1
      );
      console.log("run through jadeja cron");
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
      jadejaLogic.oneHourlyBankNiftyDesicionMaker(
        "14827266",
        "BANKNIFTY23NOVFUT",
        "NFO",
        15
      );
      console.log("run through jadeja cron");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
  cron.schedule(
    "25 10- 15 * * 1,2,3,4,5",
    () => {
      jadejaLogic.lastFiveMinuteBankNiftyDesicionMaker(
        "8979970",
        "BANKNIFTY23OCTFUT",
        "NFO",
        15
      );
      console.log("run through jadeja cron");
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
      jadejaLogic.oneHourlyNiftyDesicionMaker(
        "8980226",
        "NIFTY23OCTFUT",
        "NFO",
        50
      );
      console.log("run through jadeja cron");
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

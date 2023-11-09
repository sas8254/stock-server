const cron = require("node-cron");
const jadejaLogic = require("../logics/jadeja");

module.exports.jadejaScheduleCrudeOilMini = () => {
  cron.schedule(
    "0 10-23 * * 1,2,3,4,5",
    () => {
      // get data from data base for this instrument
      //{"instrument_token":"65610759","exchange_token":"256292","tradingsymbol":"CRUDEOILM23OCTFUT","name":"CRUDEOILM","exchange":"MCX"}
      //for Nov
      //"instrument_token":"65859335","exchange_token":"257263","tradingsymbol":"CRUDEOILM23NOVFUT","name":"CRUDEOILM","last_price":0,"expiry":"2023-11-17T00:00:00.000Z","strike":0,"tick_size":1,"lot_size":1,"instrument_type":"FUT","segment":"MCX-FUT","exchange":"MCX"}
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

module.exports.jadejaScheduleBankNifty = () => {
  cron.schedule(
    "15 10-15 * * 1,2,3,4,5",
    () => {
      // get data from data base for this instrument
      //{"instrument_token":"8979970","exchange_token":"35078","tradingsymbol":"BANKNIFTY23OCTFUT","name":"BANKNIFTY","last_price":0,"expiry":"2023-10-26T00:00:00.000Z","strike":0,"tick_size":0.05,"lot_size":15,"instrument_type":"FUT","segment":"NFO-FUT","exchange":"NFO"}

      // instrument_token: "14827266",
      // exchange_token: "57919",
      // tradingsymbol: "BANKNIFTY23NOVFUT",
      // name: "BANKNIFTY",
      // last_price: 0,
      // expiry: "2023-11-30T00:00:00.000Z",
      // strike: 0,
      // tick_size: 0.05,
      // lot_size: 15,
      // instrument_type: "FUT",
      // segment: "NFO-FUT",
      // exchange: "NFO"
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
      // get data from data base for this instrument
      //{"instrument_token":"8979970","exchange_token":"35078","tradingsymbol":"BANKNIFTY23OCTFUT","name":"BANKNIFTY","last_price":0,"expiry":"2023-10-26T00:00:00.000Z","strike":0,"tick_size":0.05,"lot_size":15,"instrument_type":"FUT","segment":"NFO-FUT","exchange":"NFO"}
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

module.exports.jadejaScheduleNiftyFifty = () => {
  cron.schedule(
    "17 10-15 * * 1,2,3,4,5",
    () => {
      // get data from data base for this instrument
      //{"instrument_token":"8980226","exchange_token":"35079","tradingsymbol":"NIFTY23OCTFUT","name":"NIFTY","last_price":0,"expiry":"2023-10-26T00:00:00.000Z","strike":0,"tick_size":0.05,"lot_size":50,"instrument_type":"FUT","segment":"NFO-FUT","exchange":"NFO"}
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

const cron = require("node-cron")
const tradeLogicStage1 = require("../logics/tradeLogicStage1")
const Stock = require("../models/stock")

module.exports.scheduleCrudeOilMini = async () => {
   cron.schedule(
      "0 10-23 * * 1,2,3,4,5",
      async () => {
         const stock = await Stock.findOne({ name: "crudeOilMini" })
         if (stock.isActiveFromAdmin) {
            tradeLogicStage1.oneHourlyCrudeOilMiniDesicionMaker(stock)
            console.log("run through trade cron")
         }
      },
      {
         scheduled: true,
         timezone: "Asia/Kolkata"
      }
   )
}

module.exports.scheduleBankNifty = async () => {
   cron.schedule(
      "16 10-15 * * 1,2,3,4,5",
      async () => {
         const stock = await Stock.findOne({ name: "bankNifty" })
         if (stock.isActiveFromAdmin) {
            tradeLogicStage1.oneHourlyBankNiftyDesicionMaker(stock)
            console.log("run through trade cron")
         }
      },
      {
         scheduled: true,
         timezone: "Asia/Kolkata"
      }
   )
   cron.schedule(
      "25 15 * * 1,2,3,4,5",
      async () => {
         const stock = await Stock.findOne({ name: "bankNifty" })
         if (stock.isActiveFromAdmin) {
            tradeLogicStage1.lastFiveMinuteBankNiftyDesicionMaker(stock)
            console.log("run through trade cron")
         }
      },
      {
         scheduled: true,
         timezone: "Asia/Kolkata"
      }
   )
}

module.exports.scheduleNiftyFifty = async () => {
   cron.schedule(
      "15 10-15 * * 1,2,3,4,5",
      async () => {
         const stock = await Stock.findOne({ name: "niftyFifty" })
         if (stock.isActiveFromAdmin) {
            tradeLogicStage1.oneHourlyNiftyFiftyDesicionMaker(stock)
            console.log("run through trade cron")
         }
      },
      {
         scheduled: true,
         timezone: "Asia/Kolkata"
      }
   )
   cron.schedule(
      "25 15 * * 1,2,3,4,5",
      async () => {
         const stock = await Stock.findOne({ name: "niftyFifty" })
         if (stock.isActiveFromAdmin) {
            tradeLogicStage1.lastFiveMinuteNiftyDesicionMaker(stock)
            console.log("run through trade cron")
         }
      },
      {
         scheduled: true,
         timezone: "Asia/Kolkata"
      }
   )
}

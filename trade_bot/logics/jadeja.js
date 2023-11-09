const kiteConnection = require("../kiteConnection/kiteConnection")
const jadejaOrderCrudeOIlMini = require("../orders/jadejaOrderCrudeOilMini")
const jadejaOrderCrudeOIl = require("../orders/jadejaOrderCrudeOil")
const jadejaOrderNiftyFifty = require("../orders/jadejaOrderNiftyFifty")
const jadejaOrderFinNifty = require("../orders/jadejaOrderFinNifty")
const jadejaOrderBankNifty = require("../orders/jadejaOrderBankNifty")
const logFilePath = "Logs\\"
const fs = require("fs")

module.exports.minutesToHour = (ary) => {
   let lastMinutesCandles
   if (+ary.slice(-1)[0][0].split("T")[1].split(":")[1] === new Date().getMinutes()) {
      ary.pop()
   }

   lastMinutesCandles = [...ary.slice(-60)]

   // console.log(lastCandleNineToEleven)
   const highAry = lastMinutesCandles.map((e) => e[2])
   const lowAry = lastMinutesCandles.map((e) => e[3])
   const open = lastMinutesCandles[0][1]
   const high = Math.max(...highAry)
   const low = Math.min(...lowAry)
   const close = lastMinutesCandles[lastMinutesCandles.length - 1][4]
   return [open, high, low, close]
}
module.exports.minutesToTenMinute = (ary) => {
   let lastMinutesCandles
   if (+ary.slice(-1)[0][0].split("T")[1].split(":")[1] === new Date().getMinutes()) {
      ary.pop()
   }

   lastMinutesCandles = [...ary.slice(-10)]

   // console.log(lastCandleNineToEleven)
   const highAry = lastMinutesCandles.map((e) => e[2])
   const lowAry = lastMinutesCandles.map((e) => e[3])
   const open = lastMinutesCandles[0][1]
   const high = Math.max(...highAry)
   const low = Math.min(...lowAry)
   const close = lastMinutesCandles[lastMinutesCandles.length - 1][4]
   return [open, high, low, close]
}
module.exports.heikinConverter = (aryy) => {
   const arrivedAry = [...aryy]
   const dP = (num) => {
      return Number(Math.round(num + "e" + 2) + "e-" + 2).toFixed(2)
   }
   // console.log(JSON.stringify(arrivedAry))
   const firstHeikinAry = []
   const dataProcess = arrivedAry.map((e, index) => {
      let close, high, open, low, flag
      if (index === 0) {
         close = (e[0] + e[1] + e[2] + e[3]) / 4
         open = e[0]
         high = e[1]
         low = e[2]
      } else {
         close = (e[0] + e[1] + e[2] + e[3]) / 4
         open = (firstHeikinAry[index - 1][0] + firstHeikinAry[index - 1][3]) / 2
         high = Math.max(e[1], open, close)
         low = Math.min(e[2], open, close)
      }

      flag = close > open ? "green" : "red"
      //   console.log([+dP(open), +dP(high), +dP(low), +dP(close), flag])
      firstHeikinAry.push([+dP(open), +dP(high), +dP(low), +dP(close), flag])
   })
   //    console.log(firstHeikinAry)
   return firstHeikinAry
}

module.exports.oneHourlyCrudeOIlDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }

      const lastHourCandle = this.minutesToHour(minutesData)

      // console.log(lastHourCandle)
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      const heikincandleData = this.heikinConverter([...arry, lastHourCandle])
      // console.log(JSON.stringify(heikincandleData))
      jadejaOrderCrudeOIl.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

module.exports.oneHourlyCrudeOilMiniDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      // console.log(rowCandles)
     
      fs.writeFile(`${logFilePath}${new Date().getDate()}-${new Date().getHours()}-1.json`, JSON.stringify(rowCandles), function (err) {
         if (err) throw err;
         console.log(' 1 Saved!');
       }) 
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }

      const lastHourCandle = this.minutesToHour(minutesData)

      // console.log(lastHourCandle)
     
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      // console.log(JSON.stringify([...arry, lastHourCandle]))
      
      fs.writeFile(`${logFilePath}${new Date().getDate()}-${new Date().getHours()}-2.json`, JSON.stringify([...arry, lastHourCandle]), function (err) {
         if (err) throw err;
         console.log('2 Saved!');
       }) 
      const heikincandleData = this.heikinConverter([...arry, lastHourCandle])
   //   console.log(heikincandleData)
      console.log(JSON.stringify(heikincandleData))
      jadejaOrderCrudeOIlMini.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

module.exports.oneHourlyNiftyDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }

      const lastHourCandle = this.minutesToHour(minutesData)

      // console.log(lastHourCandle)
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      const heikincandleData = this.heikinConverter([...arry, lastHourCandle])
      // console.log(JSON.stringify(heikincandleData))
      jadejaOrderNiftyFifty.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

module.exports.oneHourlyBankNiftyDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      // console.log(rowCandles)
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }

      const lastHourCandle = this.minutesToHour(minutesData)

      // console.log(lastHourCandle)
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      const heikincandleData = this.heikinConverter([...arry, lastHourCandle])
      // console.log(JSON.stringify(heikincandleData))
      jadejaOrderBankNifty.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

module.exports.lastFiveMinuteBankNiftyDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      // console.log(rowCandles)
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      // console.log(rowCandles)
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }
      // console.log(rowCandles)
      const lastTenMinuteCandle = this.minutesToTenMinute(minutesData)

      console.log(lastTenMinuteCandle)
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      
      const heikincandleData = this.heikinConverter([...arry, lastTenMinuteCandle])
      // console.log(JSON.stringify(heikincandleData))
      jadejaOrderBankNifty.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

module.exports.oneHourlyFinNiftyDesicionMaker = async (instrument_token, trading_symbol, exchange, lot_size) => {
   try {
      const hourlyRowCandles = await kiteConnection.getHoursMain(instrument_token)
      const minutesData = await kiteConnection.getMinutesMain(instrument_token)

      const rowCandles = [...hourlyRowCandles]
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours()) {
         rowCandles.pop()
      }
      if (+rowCandles.slice(-1)[0][0].split("T")[1].split(":")[0] === new Date().getHours() - 1) {
         rowCandles.pop()
      }

      const lastHourCandle = this.minutesToHour(minutesData)

      // console.log(lastHourCandle)
      const arry = rowCandles.slice(-40).map((e) => [e[1], e[2], e[3], e[4]])
      const heikincandleData = this.heikinConverter([...arry, lastHourCandle])
      // console.log(JSON.stringify(heikincandleData))
      jadejaOrderFinNifty.jadejaOrderHandler(heikincandleData, instrument_token, trading_symbol, exchange, lot_size)
   } catch (error) {}
}

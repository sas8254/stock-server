require("dotenv").config()
const apiCenter = require("../apiCenter")
const KiteConnect = require("kiteconnect").KiteConnect
const api_key = process.env.KITE_API_KEY;
const mailer = require("../communication/mailer")
const api_secret = process.env.KITE_API_SECRET

let enctoken = ""
let access_token = ""
const kc = new KiteConnect({
   api_key: api_key
})
const instrument_token = "256265"

module.exports.genSession = (request_token) => {
   kc.generateSession(request_token, api_secret)
      .then(function (response) {
         console.log(response)
         access_token = response.access_token
         enctoken = response.enctoken
         // init()
      })
      .catch(function (err) {
      
         console.log(err)
      })
}
let transaction_type_trial = "BUY"
const orderPlacer = async () => {
   await module.exports.placeOrder("RENUKA", transaction_type_trial, "NSE", 1)
   // setTimeout(() => {
   //    // transaction_type_trial = transaction_type_trial === "SELL" ? "BUY" : "SELL"

   //    module.exports.placeOrder("RENUKA", transaction_type_trial, "NSE", 1)
   // }, 2000)
   const j = kc
      .getPositions()
      .then((res) => console.log(res))
      .catch((err) => {})
   console.log(j)
}

setInterval(() => {
   // console.log("runnning")
   // mailer.sendMail('trial')
   //    // whatsapp.sendMsg("it is running")
   // apiCenter
   // orderPlacer()
   setTimeout(() => {}, 2000)
   // module.exports.placeOrder("RENUKA", transaction_type_trial, "NSE", 1)
   //    .getOrders(api_key, access_token, instrument_token)
   //    .then(function (response) {
   //       console.log(response)
   //       // You got user's margin details.
   //    })
   //    .catch(function (err) {
   //       console.log(err)
   // Something went wrong.
   // })
   //    // console.log(this.get2Hours())
}, 500000000)

setTimeout(() => {
   console.log(" time out run")
   // orderPlacer()
   // module.exports
   //    .generateSession()
   //    .then((res) => console.log(res.filter((e) => e.tradingsymbol === "GNFC")))
   //    .catch((err) => {})
   const getInstrument = async () => {
      const instrument = await kc.getInstruments()
      // console.log(instrument)
      instrument.length > 0 &&
         console.log(
            JSON.stringify(instrument.filter((e) => e.tradingsymbol && e.tradingsymbol.startsWith("NIFTY") && e.instrument_type === "FUT"))
         )
   }
   // const j = kc
   //    .getOrders()
   //    .then((res) => console.log(res))
   //    .catch((err) => {})
   // console.log(j)
   // getInstrument()
   limitOrderTester()
   // module.exports.placeLimitOrderByApi("GNFC","SELL","NSE",2,651)
   // module.exports.exitOrder(230704200997998)
}, 20000)
module.exports.exitOrder = async (order_id) => {
   console.log("existing order")
   console.log(order_id)
   try {
      const j = await kc.exitOrder("regular", order_id)
      if (j) {
         return j
      }
   } catch (error) {
      console.log("error in exit")
      console.log(error)
   }
}

module.exports.placeLimitOrder = async (tradingsymbol1, transaction_type1, exchange1, quantity1, price1) => {
   console.log("placing limit order")
   // console.log(transaction_type)
   try {
      const j = await kc.placeOrder("regular", {
         exchange: exchange1,
         tradingsymbol: tradingsymbol1,
         transaction_type: transaction_type1,
         quantity: quantity1,
         order_type: "LIMIT",
         product: "NRML",
         validity: "TTL",
         price: price1,
         validity_ttl: 1
      })
      if (j) {
         return j
      }
   } catch (error) {
      console.log("error in placing limit order ")
      console.log(error)

      whatsapp.sendMsg(error)
      mailer.sendMail(error)
   }
}

module.exports.placeLimitOrderByApi = async (tradingsymbol, transaction_type, exchange, quantity, price) => {
   console.log("placing limit order by api")
   console.log(transaction_type)
   try {
      const j = await apiCenter.placeOrderThroughApi(api_key, access_token, {
         exchange: exchange,
         tradingsymbol: tradingsymbol,
         transaction_type: transaction_type,
         quantity: quantity,
         order_type: "LIMIT",
         product: "NRML",
         validity: "DAY",
         price: price,
         // validity_ttl: 1
      })
      if (j) {
         return j
      }
   } catch (error) {
      console.log("error in placing limit order ")
      // console.log(error)

      // whatsapp.sendMsg(error)
      // mailer.sendMail(error)
   }
}
function orderCheckingHandler(order_id) {
   return new Promise((resolve, reject) => {
      const orderChecking = setInterval(() => {
         apiCenter.orderHistoryThroughApi(api_key,access_token,order_id)
            .then((res) => {
               // console.log(res)
               console.log(res.slice(-1)[0].status)
               if (res.slice(-1)[0].status === "COMPLETE") {
                  resolve(true)
                  clearInterval(orderChecking)
               } else if (res.slice(-1)[0].status === "CANCELLED" ||res.slice(-1)[0].status === "REJECTED") {
                  resolve(false)
                  clearInterval(orderChecking)
               }
            })
            .catch((err) => {})

         console.log("checking")
      }, 5000)

      setTimeout(() => {
         clearInterval(orderChecking)
         resolve(true)
      }, 62000)
   })
}
const limitOrderTester = async()=>{
   try {
      const orderId = await module.exports.placeLimitOrderByApi("CRUDEOILM23NOVFUT","BUY","MCX",1,6615)
     console.log(orderId+"line 185")
      const orderStatus = await orderCheckingHandler(orderId)
         console.log(orderStatus)
   } catch (error) {
      console.log(error)

   }
}

module.exports.placeOrder = async (tradingsymbol, transaction_type, exchange, quantity) => {
   console.log("placing order")
   console.log(transaction_type)
   try {
      const j = await kc.placeOrder("regular", {
         exchange: exchange,
         tradingsymbol: tradingsymbol,
         transaction_type: transaction_type,
         quantity: quantity,
         order_type: "MARKET",
         product: "NRML"
      })
      const order_history = await kc.getOrderHistory(j.order_id)
      console.log(j)
      console.log(order_history.slice(-1)[0].status)
      if (order_history.slice(-1)[0].status !== "COMPLETE") {
         throw `${tradingsymbol} order not placed watch your orders from app`
      } else {
         return j
      }
   } catch (error) {
      console.log("error in placing order")
      console.log(error)

      whatsapp.sendMsg(error)
      mailer.sendMail(error)
   }
}

module.exports.getOrderHistory = async (order_id) => {
   try {
      console.log("run")
      const j = await kc.getOrderHistory(order_id)
      return { status: j.slice(-1)[0].status, price: j.slice(-1)[0].price }
   } catch (error) {
      console.log(error)
   }
}

module.exports.getMinutesMain = async (inst_token) => {
   // console.log("minute" + enctoken)
   console.log("213" + inst_token)
   const j = apiCenter.getCandleData(inst_token, "minute", enctoken)
   return j
}
module.exports.getHoursMain = async (inst_token) => {
   console.log("218" + inst_token)
   const j = apiCenter.getCandleData(inst_token, "60minute", enctoken)
   return j
}

module.exports.kc = kc
module.exports.getPositions = async () => {
   try {
      const j = await kc.getPositions()
      // console.log(j)
      if (j) {
         return j.net
      }
   } catch (error) {
      mailer.sendMail("please generate session immidiatly")
   }
}

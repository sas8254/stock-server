const express = require("express")
const alarm = require("../communication/alarm")
const kiteConnection = require("../kiteConnection/kiteConnection")
const loginRouter = express.Router()

loginRouter.post("/token", (req, res, next) => {
   console.log("token fetched")
   console.log(req.body.token)
   console.log(req.body.token.length)
   if (req.body.token.length === 0) {
      res.status(400)
      res.send({ status: "token should not be empty" })

      //    res.end()
   } else {
      alarm.silentHandler()
      kiteConnection.genSession(req.body.token)
      res.send({ status: "your server has started" })
   }
   res.end()
})

module.exports.loginRouter = loginRouter

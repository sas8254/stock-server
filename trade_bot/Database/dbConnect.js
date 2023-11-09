// require("dotenv").config()
// const mongoose = require("mongoose")
// let jayveerConnection
// let jadejaConnection
// const connection = async () => {
//    console.log("connection run")
//    try {
//       jayveerConnection = mongoose.createConnection(`${process.env.DB_URL}/jayveer`, {
//          useNewUrlParser: true,
//          useUnifiedTopology: true
//       })
//       jadejaConnection = mongoose.createConnection(`${process.env.DB_URL}/jadeja`, {
//          useNewUrlParser: true,
//          useUnifiedTopology: true
//       })
//    } catch (error) {}
// }

// connection()

// const jayveerSchema =
//    jayveerConnection &&
//    new mongoose.Schema(
//       {
//          order_id: String,
//          transaction_type: String,
//          timestamp: {
//             type: Date,
//             default: Date.now
//          }
//       },
//       { collection: "orders" }
//    )

// const jadejaSchema =
//    jadejaConnection &&
//    new mongoose.Schema(
//       {
//          order_id: String,
//          transaction_type: String,
//          timestamp: {
//             type: Date,
//             default: Date.now
//          }
//       },
//       { collection: "orders" }
//    )
// module.exports.JayveerOrder = jayveerConnection.model("Person", jayveerSchema)
// module.exports.JadejaOrder = jadejaConnection.model("Person", jadejaSchema)

// // setTimeout(() => {
// //    const newJayveerOrder = new module.exports.JayveerOrder({
// //       order_id: "74587",
// //       transaction_type: "BUY"
// //    })
// //       .save()
// //       .then((res) => console.log(res))
// //       .catch((err) => console.log(err))

// //    //    JayveerOrder.find({})
// //    //       .then((res) => console.log(res))
// //    //       .catch((err) => console.log(err))
// // }, 10000)

// // setTimeout(() => {
// //    const newJadejaOrder = new JadejaOrder({
// //       order_id: "74587",
// //       transaction_type: "SELL"
// //    })

// //    newJadejaOrder
// //       .save()
// //       .then((res) => console.log(res))
// //       .catch((err) => console.log(err))
// // }, 15000)

// jadejaConnection && jayveerConnection.on("error", console.error.bind(console, "MongoDB connection error for Connection 1:"))
// jadejaConnection &&
//    jayveerConnection.once("open", () => {
//       console.log("Jayveer Db connected successfully.")
//    })
// jadejaConnection && jadejaConnection.on("error", console.error.bind(console, "MongoDB connection error for Connection 1:"))
// jadejaConnection &&
//    jadejaConnection.once("open", () => {
//       console.log("Jadeja Db connected successfully.")
//    })

// module.exports.dbConnectHandler = () => {}

const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["OPEN", "COMPLETE", "ACCEPTED", "REJECTED"],
  },
  tradingSymbol: {
    type: String,
    required: true,
  },

  time: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tradingType: {
    type: String,
    required: true,
    enum: ["BUY", "SELL"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Log", logSchema);

const mongoose = require("mongoose");

const brokerSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  personalSecret: {
    type: String,
  },
  apiKey: {
    type: String,
  },
  dailyAccessToken: {
    type: String,
  },

});

const stockSchema = new mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
  },
  quantity: {
    type: Number,
  },
  isActive: {
    type: Boolean,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ["user", "admin", "master", "manager"],
  },
  paymentDetail: {
    type: String,
  },
  membership: {
    type: String,
    enum: ["normal", "silver", "gold"],
  },
  managerId: {
    type: String,
  },
  isApprovedFromAdmin: {
    type: Boolean,
  },
  brokerDetail: {
    type: brokerSchema,
    required: true,
  },
  stockDetail: [stockSchema],
});

module.exports = mongoose.model("User", userSchema);

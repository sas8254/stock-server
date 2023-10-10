const mongoose = require("mongoose");

const borkerSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  personalSecret: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  dailyAccessToken: {
    type: String,
    required: true,
  },
  requestToken: {
    type: String,
    required: true,
  },
});

const stockSchema = new mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
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
    type: Number,
    required: true,
  },
  userRole: {
    type: String,
    enum: ["user", "admin", "master", "manager"],
    required: true,
  },
  paymentDetail: {
    type: String,
    required: true,
  },
  membership: {
    type: String,
    enum: ["normal", "silver", "gold"],
    required: true,
  },
  managerId: {
    type: String,
    required: true,
  },
  isApprovedFromAdmin: {
    type: Boolean,
    required: true,
  },
  brokerDetail: borkerSchema,
  stockDetail: stockSchema,
});

module.exports = mongoose.model("User", userSchema);

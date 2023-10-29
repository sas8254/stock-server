const Log = require("../models/logs");

exports.addLog = async (req, res) => {
  // return res.send(req.body);
  try {
    const {
      orderId,
      orderStatus,
      userId,
      tradingSymbol,
      time,
      price,
      tradingType,
    } = req.body;
    const newLog = new Log({
      orderId,
      orderStatus,
      tradingSymbol,
      time,
      price,
      tradingType,
      userId,
    });
    const log = await newLog.save();
    res.status(201).json({
      message: "Log added successfully",
      log,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};



exports.getAllLogs = async (req, res) => {
  try {
    const log = await Log.find({});
    res.status(200).json({
      log,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};




const Log = require("../models/logs");

exports.addLog = async (req, res) => {
  // return res.send(req.body);
  try {
    const {
      orderId,
      orderStatus,
      userId,
      tradingsymbol,
      time,
      price,
      transaction_type,
    } = req.body;
    const newLog = new Log({
      orderId,
      orderStatus,
      tradingsymbol,
      time,
      price,
      transaction_type,
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

exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    const logs = await Log.find({ userId: userId });

    if (!logs) {
      return res.status(404).json({ message: "No logs found for this user." });
    }

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





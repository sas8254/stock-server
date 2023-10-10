const Stock = require("../models/stock");

exports.addStock = async (req, res) => {
  // return res.send(req.body);
  try {
    const {
      name,
      status,
      silverQuantity,
      goldQuantity,
      isBuyAllowed,
      isSellAllowed,
      isCronStop,
      isActiveFromAdmin,
      brokerDetail,
    } = req.body;
    const newStock = new Stock({
      name,
      status,
      silverQuantity,
      goldQuantity,
      isBuyAllowed,
      isSellAllowed,
      isCronStop,
      isActiveFromAdmin,
      brokerDetail,
    });
    const stock = await newStock.save();
    res.status(201).json({
      message: "Stock added successfully",
      stock,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.Id);
    if (stock === null) {
      return res.json("No stock found!");
    }
    res.status(200).json({
      stock,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const stock = await Stock.find({});
    res.status(200).json({
      stock,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.editStock = async (req, res) => {
  try {
    const {
      name,
      status,
      silverQuantity,
      goldQuantity,
      isBuyAllowed,
      isSellAllowed,
      isCronStop,
      isActiveFromAdmin,
      brokerDetail,
    } = req.body;

    const stock = await Stock.findByIdAndUpdate(
      req.params.Id,
      {
        name,
        status,
        silverQuantity,
        goldQuantity,
        isBuyAllowed,
        isSellAllowed,
        isCronStop,
        isActiveFromAdmin,
        brokerDetail,
      },
      { new: true }
    );
    res.status(200).json({
      stock,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const removedType = await Stock.findByIdAndRemove(req.params.Id);
    if (removedType === null) {
      return res.status(500).json("No stock found!");
    }
    res.status(200).json("Stock Deleted Successfully");
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

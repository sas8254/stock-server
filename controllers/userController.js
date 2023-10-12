const User = require("../models/user");

exports.addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNo,
      password,
      userRole,
      paymentDetail,
      membership,
      managerId,
      isApprovedFromAdmin,
      brokerDetail,
      stockDetail,
    } = req.body;
    const newUser = new User({
      name,
      email,
      mobileNo,
      password,
      userRole,
      paymentDetail,
      membership,
      managerId,
      isApprovedFromAdmin,
      brokerDetail,
      stockDetail,
    });
    const user = await newUser.save();
    res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.Id);
    if (user === null) {
      return res.json("No user found!");
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNo,
      password,
      userRole,
      paymentDetail,
      membership,
      managerId,
      isApprovedFromAdmin,
      brokerDetail,
      stockDetail,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.Id,
      {
        name,
        email,
        mobileNo,
        password,
        userRole,
        paymentDetail,
        membership,
        managerId,
        isApprovedFromAdmin,
        brokerDetail,
        stockDetail,
      },
      { new: true }
    );
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const removedType = await User.findByIdAndRemove(req.params.Id);
    if (removedType === null) {
      return res.status(500).json("No user found!");
    }
    res.status(200).json("User Deleted Successfully");
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

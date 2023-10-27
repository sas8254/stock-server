const User = require("../models/user");
const bcrypt = require("bcrypt");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobileNo,
      password:hashedPassword,
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
    const user = await User.findById(req.params.Id)
    .select("-brokerDetail.clientId -brokerDetail.personalSecret -brokerDetail.dailyAccessToken");;
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
    const users = await User.find({})
    .select("-brokerDetail.clientId -brokerDetail.personalSecret -brokerDetail.dailyAccessToken");
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.editUser = async (req, res) => {
  // return res.send(req.body);
  try {
    const {
      name,
      email,
      mobileNo,
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

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      req.params.Id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    res.status(200).json("Password changed successfullly.");
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

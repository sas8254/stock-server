const User = require("../models/user");
const bcrypt = require("bcrypt");
const KiteConnect = require("kiteconnect").KiteConnect;

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: hashedPassword,
      },
      { new: true }
    ).select(
      "-brokerDetail.clientId -brokerDetail.personalSecret -brokerDetail.dailyAccessToken -password"
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

module.exports.genSession = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);
    const api_key = foundUser.brokerDetail.apiKey;
    const api_secret = foundUser.brokerDetail.personalSecret;
    const requestToken = req.body.requestToken;
    const daily_access_token = "";

    const kc = new KiteConnect({
      api_key: api_key,
    });
    kc.generateSession(requestToken, api_secret)
      .then(function (response) {
        console.log(response);
        daily_access_token = response.access_token;
        //  enctoken = response.enctoken
        // init()
      })
      .catch(function (err) {
        return res.status(500).json({
          message: "An error occurred",
          err,
        });
      });

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { "brokerDetail.dailyAccessToken": daily_access_token },
      },
      { new: true }
    );
    res.status(200).json({
      message: "dailyAccessToken saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, mobileNo, password, clientId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobileNo,
      password: hashedPassword,
      brokerDetail: {
        clientId: clientId,
      },
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
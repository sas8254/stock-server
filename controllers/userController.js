const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.changePassword = async (req, res) => {
    try {
      const {
        password,
      } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const foundUser = await User.findById(req.user.id)
      console.log(foundUser)
  
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          password:hashedPassword,
        },
        { new: true }
      ).select("-brokerDetail.clientId -brokerDetail.personalSecret -brokerDetail.dailyAccessToken");
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
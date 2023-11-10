const apiCenter = require("../utils/apiCenter");
const User = require("../models/user");

let alarm;

module.exports.healthChecker = async () => {
  try {
    const user = await User.findById("6539eb4c7e2bbafb2d5ad569");
    let enctoken = user.brokerDetail.enctoken;
    alarm = setInterval(() => {
      if ([1, 2, 3, 4, 5].includes(new Date().getDay())) {
        if (
          (new Date().getHours() === 8 && new Date().getMinutes() > 45) ||
          new Date().getHours() > 8
        ) {
          apiCenter.getCandleData("256265", "minute", enctoken);
          console.log("health checking");
        }
      }
    }, 200000);
  } catch (error) {
    console.log("error in alarm checker", error);
  }
};

module.exports.silentHandler = () => {
  clearInterval(alarm);
  console.log("silent handler run");
  setTimeout(() => {
    module.exports.healthChecker();
  }, 30000);
};

const apiCenter = require("../apiCenter");

let alarm;
module.exports.alarmChecker = () => {
  alarm = setInterval(() => {
    if ([1, 2, 3, 4, 5].includes(new Date().getDay())) {
      if (
        (new Date().getHours() === 8 && new Date().getMinutes() > 45) ||
        new Date().getHours() > 8
      ) {
        apiCenter.getCandleData("256265", "minute"); // send enc token as third argument.
        console.log("health checking");
      }
    }
  }, 200000);
};

module.exports.silentHandler = () => {
  clearInterval(alarm);
  console.log("silent handler run");
  setTimeout(() => {
    module.exports.alarmChecker();
  }, 30000);
};

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const loginRouter = require("./routes/loginNavigator");
const alarm = require("./communication/alarm");
const cors = require("cors");
const cron = require("./business/cron");

const app = express();

alarm.alarmChecker();
cron.jadejaScheduleBankNifty();
cron.jadejaScheduleCrudeOilMini();
cron.jadejaScheduleNiftyFifty();

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(loginRouter.loginRouter);

app.use((error, req, res, next) => {
  console.log("in moddlewere" + error);
});
app.listen(process.env.SERVER_PORT);

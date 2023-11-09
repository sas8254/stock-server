require("dotenv").config();
const axios = require("axios");
const mailer = require("./communication/mailer");

module.exports.instance = () => {
  return axios.create({
    baseURL: `${process.env.ZERODHA_URL}`,
  });
};

module.exports.getCandleData = async (
  instrument_token,
  interval,
  enc_token
) => {
  let toDate = new Date();
  let formDateForHour = new Date();
  let formDateForMinute = new Date();
  formDateForHour.setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
  formDateForMinute.setTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  formDateForHour = formDateForHour.toISOString().split("T")[0];
  formDateForMinute = formDateForMinute.toISOString().split("T")[0];
  toDate = new Date().toISOString().split("T")[0];
  // console.log("hii enc token" + enc_token)
  console.log(toDate);
  console.log("at api" + instrument_token);
  const newInstance = this.instance();
  try {
    const j = await newInstance.get(
      `/oms/instruments/historical/${instrument_token}/${interval}?user_id=${
        process.env.KITE_USER_ID
      }&oi=1&from=${
        interval === "minute" ? formDateForMinute : formDateForHour
      }&to=${toDate}`,
      {
        headers: {
          Authorization: `enctoken ${enc_token}`,
        },
      }
    );
    // console.log(JSON.stringify(j.data.data))

    return j.data.data.candles;
  } catch (error) {
    mailer.sendMail("something went wrong");
    console.log(error);
  }
};

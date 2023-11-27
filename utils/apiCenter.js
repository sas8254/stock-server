require("dotenv").config();
const axios = require("axios");
const mailer = require("./mailer");
const User = require("../models/user");

const instance = () => {
  return axios.create({
    baseURL: `${process.env.ZERODHA_URL}`,
  });
};

const getCandleData = async (instrument_token, interval) => {
  let toDate = new Date();
  let formDateForHour = new Date();
  let formDateForMinute = new Date();
  formDateForHour.setTime(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
  formDateForMinute.setTime(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  formDateForHour = formDateForHour.toISOString().split("T")[0];
  formDateForMinute = formDateForMinute.toISOString().split("T")[0];
  toDate = new Date().toISOString().split("T")[0];

  const newInstance = instance();
  try {
    const user = await User.findOne({ name: "admin" });
    let enc_token = user.brokerDetail.enctoken;
    const response = await newInstance.get(
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

    return response.data.data.candles;
  } catch (error) {
    mailer.sendMail("something went wrong");
    console.log(error);
  }
};

const getMinutesMain = async (inst_token) => {
  const response = await getCandleData(inst_token, "minute");
  return response;
};
const getHoursMain = async (inst_token) => {
  const response = await getCandleData(inst_token, "60minute");
  return response;
};

const getLatestClose = async (inst_token) => {
  const response = await getCandleData(inst_token, "minute");
  const price = response.slice(-1)[0][4];
  return price;
};

module.exports = {
  getCandleData,
  getMinutesMain,
  getHoursMain,
  getLatestClose,
};
module.exports.genSession = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);
    const api_key = foundUser.brokerDetail.apiKey;
    const api_secret = foundUser.brokerDetail.personalSecret;
    const requestToken = req.body.requestToken;
    let daily_access_token = null;
    let enctoken = null;

    const kc = new KiteConnect({
      api_key: api_key,
    });
    await kc
      .generateSession(requestToken, api_secret)
      .then(function (response) {
        console.log(response);
        daily_access_token = response.access_token;
        enctoken = response.enctoken;
        // init()
      })
      .catch(function (err) {
        // console.log(err)
        return res.status(500).json({
          message: "An error occurred redirect and try again to save",
          err,
        });
      });
    if (daily_access_token && enctoken) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            "brokerDetail.dailyAccessToken": daily_access_token,
            "brokerDetail.enctoken": enctoken,
          },
        },
        { new: true }
      );
      res.status(200).json({
        message: "dailyAccessToken saved successfully",
      });
    } else {
      console.log("juni token mokli topa");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

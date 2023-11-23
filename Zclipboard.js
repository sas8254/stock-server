exports.getPositions = async (req, res) => {
  const newInstance = instance();

  try {
    const user = await User.findById(req.params.id);
    const api_key = user.brokerDetail.apiKey;
    const access_token = user.brokerDetail.dailyAccessToken;

    const response = await newInstance.get("/portfolio/positions", {
      headers: {
        "X-Kite-Version": process.env.KITE_VERSION,
        Authorization: `token ${api_key}:${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response.data.data);
    if (response) {
      res.status(200).json({ response: JSON.stringify(response.data.data) });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred",
      error,
    });
  }
};

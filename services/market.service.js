module.exports = () => {
  const axios = require("axios");

  const getRealMarketPrices = async () => {
    if (!process.env.AGMARKNET_API_KEY) {
      return [
        { crop: "Tomato", price: 2500, market: "Local" },
        { crop: "Onion", price: 1200, market: "Local" },
      ];
    }
    try {
      const { data } = await axios.get("https://api.example.com/market", {
        params: { api_key: process.env.AGMARKNET_API_KEY },
      });
      return data.records || [];
    } catch (err) {
      return [{ crop: "Tomato", price: 2500, market: "Local" }];
    }
  };

  return { getRealMarketPrices };
};

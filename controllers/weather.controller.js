// Weather Controller
const axios = require("axios");

class WeatherController {
  constructor(logger) {
    this.logger = logger;
  }

  async getWeather(req, res, next) {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng)
        return res.status(400).json({ error: "lat and lng required" });
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      res.json(response.data);
    } catch (err) {
      this.logger?.error("Weather API error", { error: err.message });
      next(err);
    }
  }
}

module.exports = WeatherController;

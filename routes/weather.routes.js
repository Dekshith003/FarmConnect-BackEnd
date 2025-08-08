const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const logger = require("../utils/logger");
const WeatherController = require("../controllers/weather.controller");
const weatherController = new WeatherController(logger);

router.get("/", protect, weatherController.getWeather.bind(weatherController));

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const TrendingController = require("../controllers/trending.controller");
const cropService = require("../services/crop.service")();
const trendingController = new TrendingController(cropService);

router.get(
  "/",
  protect,
  trendingController.getTrending.bind(trendingController)
);

module.exports = router;

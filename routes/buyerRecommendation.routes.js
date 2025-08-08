const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const AiService = require("../services/ai.service");
const logger = require("../utils/logger");
const BuyerRecommendationController = require("../controllers/buyerRecommendation.controller");
const aiService = new AiService(logger);
const buyerRecommendationController = new BuyerRecommendationController(
  aiService
);

router.post(
  "/recommend",
  protect,
  buyerRecommendationController.recommend.bind(buyerRecommendationController)
);

module.exports = router;

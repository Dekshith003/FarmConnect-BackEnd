const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const AiService = require("../services/ai.service");
const aiService = new AiService(require("../utils/logger"));
const marketService = require("../services/market.service")();
const mapService = require("../services/map.service")({
  marketService,
  aiService,
});
const mapController = require("../controllers/map.controller")({ mapService });

// Public: get nearby crops
router.get("/crops", mapController.nearbyCrops);

// Public: get nearby farms
router.get("/farms", mapController.nearbyFarms);

// Public: summary/aggregation
router.get("/summary", mapController.summary);

// Protected: AI-powered recommendations (requires login for personalized content)
router.post("/recommendations", protect, mapController.recommendations);

module.exports = router;

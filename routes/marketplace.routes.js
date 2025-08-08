const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const AiService = require("../services/ai.service");
const aiService = new AiService(require("../utils/logger"));
const marketplaceService = require("../services/marketplace.service")({
  aiService,
});
const MarketplaceController = require("../controllers/marketplace.controller");
const marketplaceController = new MarketplaceController(marketplaceService);

// Public: Get all crops with filters
router.get("/", marketplaceController.getCrops);

// Public: Get nearby crops
router.get("/nearby", marketplaceController.getNearbyCrops);

// Protected: AI recommendations based on location
router.get(
  "/recommendations",
  protect,
  marketplaceController.getAiRecommendations
);

// Public: Get crop details
router.get("/:id", marketplaceController.getCropDetails);

module.exports = router;

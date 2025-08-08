const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { validateRequest } = require("../middlewares/validate.middleware");
const AiService = require("../services/ai.service");
const logger = require("../utils/logger");
const AiController = require("../controllers/ai.controller");
const aiService = new AiService(logger);
const aiController = new AiController(aiService);

// Predict endpoint
router.post(
  "/predict",
  protect,
  validateRequest,
  aiController.predict.bind(aiController)
);

// Recommend endpoint
router.post(
  "/recommend",
  protect,
  validateRequest,
  aiController.recommend.bind(aiController)
);

module.exports = router;

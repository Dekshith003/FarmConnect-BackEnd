const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware.js");
const validateRequest = require("../middlewares/validate.middleware.js");
const AiService = require("../services/ai.service.js");
const logger = require("../utils/logger.js");
const AiController = require("../controllers/ai.controller.js");

const aiService = new AiService(logger);
const aiController = new AiController(aiService);

router.post("/predict", protect, validateRequest, (req, res, next) => {
  aiController.predict(req, res, next);
});

router.post("/recommend/crops", protect, validateRequest, (req, res, next) => {
  aiController.recommend(req, res, next);
});

module.exports = router;

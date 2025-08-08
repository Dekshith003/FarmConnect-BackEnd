const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const logger = require("../utils/logger");
const AiService = require("../services/ai.service");
const aiService = new AiService(logger);
const marketPriceService = require("../services/market.service")();
const dashboardService = require("../services/dashboard.service")({
  aiService,
  marketPriceService,
});
const ctrl = require("../controllers/dashboard.controller")({
  dashboardService,
});

router.get("/", protect, ctrl.getDashboard);

module.exports = router;

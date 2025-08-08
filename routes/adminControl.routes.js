const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const AdminControlController = require("../controllers/adminControl.controller");
const adminControlController = new AdminControlController();

router.post(
  "/toggle",
  protect,
  adminControlController.toggleFeature.bind(adminControlController)
);
router.get(
  "/analytics",
  protect,
  adminControlController.getAnalytics.bind(adminControlController)
);

module.exports = router;

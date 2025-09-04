const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware"); // This should use pest-images
const { protect, allowRoles } = require("../middlewares/auth.middleware");
const { FARMER } = require("../constants/roles");
const pestService = require("../services/pest.service")();
const pestController = require("../controllers/pest.controller")({
  pestService,
});

router.post(
  "/detect",
  protect,
  allowRoles(FARMER),
  upload.single("image"), // This should match the field name from frontend
  pestController.detectPest
);

// Pest detection history for logged-in farmer
router.get("/history", protect, allowRoles(FARMER), pestController.getHistory);

module.exports = router;

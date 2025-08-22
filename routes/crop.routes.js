// routes/crop.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate.middleware");
const { protect, allowRoles } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const fs = require("fs");

const cropService = require("../services/crop.service")();
const ctrl = require("../controllers/crop.controller")({ cropService });
const { FARMER } = require("../constants/roles");

// Patch upload middleware to use crop-images folder for crop uploads
const cropUpload = upload;
cropUpload.storage.getDestination = function (req, file, cb) {
  const dir = "uploads/crop-images/";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  cb(null, dir);
};

// Create crop (farmer) — allows multiple images
router.post(
  "/post",
  protect,
  allowRoles(FARMER),
  cropUpload.array("images", 5),
  [
    body("name").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("quantity").isNumeric(),
    body("price").isNumeric(),
    body("city").isString().notEmpty(),
    body("state").isString().notEmpty(),
  ],
  validateRequest,
  ctrl.create
);

// My listings (farmer)
router.get("/my-listings", ctrl.myListings);

// Mark as sold
router.patch("/mark-sold/:id", protect, allowRoles(FARMER), ctrl.markAsSold);

// Delete crop
router.delete("/:id", protect, allowRoles(FARMER), ctrl.remove);

// Marketplace search (optional query params: search, category, lat, lng, radius, priceMin, priceMax)
router.get("/marketplace", ctrl.marketplace);

// Crop details
router.get("/:id", ctrl.getCropDetails);

// Get all crops for a specific farmerId (admin/customer viewing another farmer's crops)
router.get("/farmer/:farmerId/crops", ctrl.myCropsByFarmer);

module.exports = router;

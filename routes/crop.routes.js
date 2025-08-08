// routes/crop.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate.middleware");
const { protect, allowRoles } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware"); // multer instance
const logger = require("../utils/logger");

const cropService = require("../services/crop.service")();
const ctrl = require("../controllers/crop.controller")({ cropService });
const { FARMER } = require("../constants/roles");

/**
 * Farmer routes (protected)
 */

// Create crop (farmer) — allows multiple images
router.post(
  "/post",
  protect,
  allowRoles(FARMER),
  upload.array("images", 5),
  [
    body("name").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("quantity").isNumeric(),
    body("price").isNumeric(),
    body("location").custom((v) => {
      if (!v) throw new Error("location is required");
      // expect location as JSON string or object; accept stringified JSON from form-data
      let loc = v;
      if (typeof v === "string") {
        try {
          loc = JSON.parse(v);
        } catch (e) {
          throw new Error("location must be JSON");
        }
      }
      if (
        !loc.coordinates ||
        !Array.isArray(loc.coordinates) ||
        loc.coordinates.length !== 2
      ) {
        throw new Error("location.coordinates [lng,lat] required");
      }
      return true;
    }),
  ],
  validateRequest,
  ctrl.create
);

// My listings (farmer)
router.get("/my-listings", protect, allowRoles(FARMER), ctrl.myListings);

// Mark as sold
router.patch("/mark-sold/:id", protect, allowRoles(FARMER), ctrl.markAsSold);

// Delete crop
router.delete("/:id", protect, allowRoles(FARMER), ctrl.remove);

/**
 * Public / customer routes
 */

// Marketplace search (optional query params: search, category, lat, lng, radius, priceMin, priceMax)
router.get("/marketplace", ctrl.marketplace);

// Crop details
router.get("/:id", ctrl.getDetails);

module.exports = router;

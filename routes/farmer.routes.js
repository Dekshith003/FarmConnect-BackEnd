const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate.middleware");

const { protect, allowRoles } = require("../middlewares/auth.middleware");
const { FARMER } = require("../constants/roles");

const farmerService = require("../services/farmer.service")();
const ctrl = require("../controllers/farmer.controller")({ farmerService });

router.use(protect, allowRoles(FARMER));

router.put(
  "/complete-profile",
  [body("phone").optional().isString(), body("farmName").optional().isString()],
  validateRequest,
  ctrl.completeProfile
);

router.post(
  "/post-crop",
  [
    body("name").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("quantity").isNumeric(),
    body("price").isNumeric(),
    body("location").custom((v) => {
      if (
        !v ||
        !v.coordinates ||
        !Array.isArray(v.coordinates) ||
        v.coordinates.length !== 2
      ) {
        throw new Error("location.coordinates [lng,lat] required");
      }
      return true;
    }),
    body("image").isString().notEmpty(),
  ],
  validateRequest,
  ctrl.postCrop
);

router.get("/my-crops", ctrl.getMyListings);
router.patch("/mark-sold/:id", ctrl.markAsSold);

module.exports = router;

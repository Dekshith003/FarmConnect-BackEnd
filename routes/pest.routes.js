const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
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
  upload.single("image"),
  pestController.detectPest
);

module.exports = router;

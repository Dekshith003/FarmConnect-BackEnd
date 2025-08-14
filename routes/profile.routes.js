// routes/profile.routes.js
const express = require("express");

const profileService = require("../services/profile.service")();
const ctrl = require("../controllers/profile.controller")({ profileService });
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", ctrl.createOrUpdate);
router.put("/", ctrl.updateProfile);
router.get("/", ctrl.getProfile);
router.delete("/", ctrl.deleteProfile);

module.exports = router;

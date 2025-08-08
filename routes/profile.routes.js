// routes/profile.routes.js
const express = require("express");

const profileService = require("../services/profile.service")();
const ctrl = require("../controllers/profile.controller")({ profileService });
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", ctrl.createOrUpdate);
router.get("/", ctrl.getProfile);
router.delete("/", ctrl.deleteProfile);

module.exports = router;

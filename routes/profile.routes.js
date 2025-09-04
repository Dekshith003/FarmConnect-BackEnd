// routes/profile.routes.js
const express = require("express");

const profileService = require("../services/profile.service")();
const ctrl = require("../controllers/profile.controller")({ profileService });
const { protect } = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Avatar upload config
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join("uploads", "avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${Date.now()}${ext}`);
  },
});
const uploadAvatar = multer({ storage: avatarStorage });

const router = express.Router();

router.use(protect);

// View own profile
router.get("/", ctrl.getProfile);
// Update own profile
router.put("/", uploadAvatar.single("avatar"), ctrl.updateProfile);
// View profile by userId
router.get("/:userId", ctrl.getProfileById);

module.exports = router;

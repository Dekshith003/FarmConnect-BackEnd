const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middlewares/auth.middleware");
const { ADMIN } = require("../constants/roles");
const adminService = require("../services/admin.service")();
const adminController = require("../controllers/admin.controller")({
  adminService,
});

router.use(protect, allowRoles(ADMIN));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.listUsers);
router.get("/crops", adminController.listCrops);
router.delete("/crops/:id", adminController.deleteCrop);

module.exports = router;

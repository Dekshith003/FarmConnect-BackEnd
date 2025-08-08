const express = require("express");
const router = express.Router();

const { protect, allowRoles } = require("../middlewares/auth.middleware");
const { CUSTOMER } = require("../constants/roles");
const customerService = require("../services/customer.service")();
const ctrl = require("../controllers/customer.controller")({ customerService });

router.use(protect, allowRoles(CUSTOMER));

router.get("/marketplace", ctrl.getMarketplaceCrops);
router.get("/crop/:id", ctrl.getCropDetails);

module.exports = router;

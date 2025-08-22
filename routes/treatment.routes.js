const express = require("express");
const router = express.Router();
const treatmentController = require("../controllers/treatment.controller");

// POST /api/treatment
router.post("/", treatmentController.getTreatment);

module.exports = router;

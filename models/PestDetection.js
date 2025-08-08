const mongoose = require("mongoose");

const pestSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    imageUrl: String,
    detectedIssue: Object,
    confidence: Number,
    recommendations: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PestDetection", pestSchema);
